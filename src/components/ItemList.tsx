import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    createAnimation,
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonList, IonLoading, IonModal,
    IonPage, IonRadio, IonRadioGroup, IonSearchbar, IonSelect, IonSelectOption,
    IonText,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from "@ionic/react";
import Item from "./Item";
import {getLogger} from "../core";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {ItemContext} from "./ItemProvider";
import {AuthContext} from "../auth/AuthProvider";
import {ItemProps} from "./ItemProps";
import {NetworkState} from "./NetworkState";
import {useMyLocation} from "./map/useMyLocation";
import {MyMap} from "./map/MyMap";

const indicesPresent = 5;

const log = getLogger("ItemList");
export const ItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {items, fetching, fetchingError, setSearchText, searchText} = useContext(ItemContext);
    const myLocation = useMyLocation();
    const {latitude: lat, longitude: lng} = myLocation.position?.coords || {latitude:5, longitude:5};
    const {logout} = useContext(AuthContext);
    const [itemsAux ,setItemsAux] = useState<ItemProps[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [hasFetched, setHasFetched] = useState<boolean>(false);

    const [prices, setPrices] = useState<number[]>([]);

    const [filter, setFilter] = useState<number | undefined>(undefined);

    if(!hasFetched) {
        if(items){
            fetchData();
            setHasFetched(true);
        }
    }

    function onlyUnique(value:any, index:any, self:any) {
        return self.indexOf(value) === index;
    }
    useEffect(simpleAnimation, [])

    function simpleAnimation() {
        const el = document.querySelectorAll('.item-list');
        if (el) {
            const animation = createAnimation()
                .addElement(el)
                .duration(5000)
                .iterations(1)
                .fromTo('transform', 'translateX(50%)', 'translateX(0px)');
            animation.play();
        }
    }

    function fetchData(){
        if(items){
            const newIndex = Math.min(index + indicesPresent, items.length);
            if( newIndex >= items.length){
                setHasMore(false);
            }
            else{
                setHasMore(true);
            }
            setItemsAux(items.slice(0, newIndex));
            setIndex(newIndex);
            setPrices(items.map( item => item.price).filter(onlyUnique));
        }
    }
    useIonViewWillEnter( async () => {
        await fetchData();
    })


    function handleTextChange(e: any){
        log('event', e.detail.value!!);
        setItemsAux([]);
        setIndex(0);
        setHasFetched(false);
        setHasMore(true);
        setSearchText?.(e.detail.value!!);
    }

    async function searchNext($event: CustomEvent<void>){
        await fetchData();
        await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lab PDM List </IonTitle>
                    <NetworkState />
                    <IonButton onClick={handleLogout}>Logout</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {/*< MyMap/>*/}
                <IonSearchbar value={searchText} onIonChange={e=> handleTextChange(e)} />
                <IonLabel>Select Price</IonLabel>
                <IonSelect value={filter} placeholder="Select price" onIonChange={e => setFilter(e.detail.value)}>
                    <IonSelectOption key={0} value={0}>All Prices</IonSelectOption>
                    {prices.map(price => <IonSelectOption key={price} value={price}> {price} </IonSelectOption>)}
                </IonSelect>
                <IonLoading isOpen={fetching} message="Fetching foods" />
                <IonList class="item-list">

                {itemsAux
                    .filter(item => !filter || item.price == filter)
                    .filter (item => item.foodName.includes(searchText))
                        .map(({_id, foodName, price, dateBought, onSale, latitude, longitude}) =>
                         <Item key={foodName} _id={_id} foodName={foodName} price={price}
                               dateBought={dateBought} onSale={onSale}
                               latitude={latitude}  longitude={longitude}
                               onEdit={id => history.push(`/item/${id}`)}/> )
                }

                </IonList>

                <IonInfiniteScroll threshold="0px" disabled={!hasMore} onIonInfinite={(e:CustomEvent<void>) => searchNext(e)} >
                    <IonInfiniteScrollContent loadingText="Loading more food..." >
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch foods'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed" >
                    <IonFabButton onClick={() => history.push('/item')}  >
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
            <IonFooter>
            </IonFooter>
        </IonPage>

    );
    function handleLogout(){
        logout?.();
        history.push('/login');
    }

};

