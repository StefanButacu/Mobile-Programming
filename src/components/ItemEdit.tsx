import {RouteComponentProps} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {ItemContext} from "./ItemProvider";
import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent,
    IonHeader,
    IonInput, IonItem, IonLabel,
    IonLoading,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {ItemProps} from "./ItemProps";
import {getLogger} from "../core/utils";
import {on} from "cluster";

const log = getLogger('itemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id? : string;
}> {}
const ItemEdit:React.FC<ItemEditProps> = ({history, match}) =>{
    const {items, saving, savingError, saveItem} = useContext(ItemContext);
    const [item, setItem] = useState<ItemProps>();
    const [foodName, setFoodName] = useState('');
    const [price, setPrice] = useState(0);
    const [dateBought, setDateBought] = useState(new Date());
    const [onSale, setOnSale] = useState(true);
    useEffect( () =>{
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it.id == routeId);
        setItem(item);
        if(item){
            setFoodName(item.foodName);
            setPrice(item.price);
            setDateBought(new Date(Date.parse(item.dateBought.toString())));
            setOnSale(item.onSale)
        }

    },[match.params.id, items]);
    const handleSave = useCallback( () => {
        const editedItem = item ? {...item, foodName, price, dateBought, onSale} : {foodName, price, dateBought , onSale };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    }, [item, saveItem, foodName, price, dateBought, onSale, history]);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end" >
                        <IonButton onClick={handleSave} >
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
           </IonHeader>
           <IonContent>
               <IonItem>
                   <IonLabel position="fixed" >FoodName</IonLabel>
                    <IonInput value={foodName} onIonChange={e => setFoodName(e.detail.value || '')}/>
               </IonItem>
               <IonItem>
                   <IonLabel position="fixed" >Price</IonLabel>
                   <IonInput value={price} type="number" onIonChange={e =>
                       setPrice(e.detail.value ? +e.detail.value : 0)
                   }/>
               </IonItem>
               <IonItem>
                   <IonLabel position="fixed" >DateBought</IonLabel>
                   <IonInput value={dateBought.toString()} onIonChange={e => {
                       setDateBought(e.detail.value ? new Date(e.detail.value) : new Date());
                   }}/>
               </IonItem>
               <IonItem>
                   <IonLabel position="fixed" >OnSale</IonLabel>
                    <IonCheckbox checked={onSale} onIonChange={ e=>{
                        setOnSale(!onSale);
                    }

                    }></IonCheckbox>
                </IonItem>

               <IonLoading isOpen={saving} />
               {savingError && (
                   <div>{savingError.message || 'Failed to save item'}</div>
               )}
           </IonContent>


        </IonPage>
    )

}




export default ItemEdit;