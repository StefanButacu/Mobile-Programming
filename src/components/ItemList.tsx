import React, {useCallback, useState} from 'react';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonFooter,
    IonHeader, IonIcon, IonList, IonLoading,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import Item from "./Item";
import {getLogger} from "../core/utils";
import {add} from "ionicons/icons";
import {useItems} from "./customHooks/addItem";

const log = getLogger("ItemList");

const ItemList: React.FC = () => {
    const {items, fetching, fetchingError, addItem} = useItems();
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lab PDM </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching foods" />
                {items && (
                    <IonList>
                        {items.map(({id, foodName, price, dateBought, onSale}) =>
                    <Item key={id} foodName={foodName} price={price} dateBought={dateBought} onSale={onSale}/> )}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed" >
                    <IonFabButton onClick={addItem}  >
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