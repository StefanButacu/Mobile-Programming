import React, {useState} from 'react';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader, IonIcon,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import Item from "./Item";
import {getLogger} from "../core/utils";
import {add} from "ionicons/icons";

const log = getLogger("ItemList");

const ItemList: React.FC = () => {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() -1 );
    const [items, setItems] = useState( [
        {id:1, foodName:"food1", price: 20, dateBought: new Date(), onSale:false},
        {id:2, foodName:"food2", price: 23, dateBought: yesterday, onSale:true},
    ]);
    console.log(items);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lab PDM </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {items.map(({id, foodName, price, dateBought, onSale}) =>
                    <Item key={id} foodName={foodName} price={price} dateBought={dateBought} onSale={onSale}/> )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed" >
                    <IonFabButton onClick={() => console.log("ceva")}  >
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

export default ItemList;