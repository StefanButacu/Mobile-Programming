import React, {useCallback, useContext, useState} from 'react';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader, IonIcon, IonList, IonLoading,
    IonPage, IonRadio, IonRadioGroup,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import Item from "./Item";
import {getLogger} from "../core";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {ItemContext} from "./ItemProvider";

const log = getLogger("ItemList");
export const ItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {items, fetching, fetchingError} = useContext(ItemContext);
    log('items: ', items);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lab PDM List </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching foods" />
                {items && (
                    <IonList>
                        {items.map(({_id, foodName, price, dateBought, onSale}) =>
                    <Item key={_id} _id={_id} foodName={foodName} price={price}
                          dateBought={dateBought} onSale={onSale} onEdit={id => history.push(`/item/${id}`)}/> )}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed" >
                    <IonFabButton onClick={() => history.push('/item')}  >
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
            <IonFooter>
             <IonText> Text From Footer</IonText>
            </IonFooter>
        </IonPage>

    );
};

