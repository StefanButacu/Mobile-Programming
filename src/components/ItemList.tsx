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
import {getLogger} from "../core/utils";
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {ItemContext} from "./ItemProvider";

const log = getLogger("ItemList");
export const ItemList: React.FC<RouteComponentProps> = ({history}) => {
    const {items, fetching, fetchingError} = useContext(ItemContext);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Lab PDM List </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <div>Hello world!</div>
                <IonLoading isOpen={fetching} message="Fetching foods" />
                {items && (
                    <IonList>
                        {items.map(({id, foodName, price, dateBought, onSale}) =>
                    <Item key={id} id={id} foodName={foodName} price={price}
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

