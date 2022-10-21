import {RouteComponentProps} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {ItemContext} from "./ItemProvider";
import {IonButton, IonButtons, IonContent, IonHeader, IonLoading, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import {ItemProps} from "./ItemProps";
import {getLogger} from "../core/utils";

const log = getLogger('itemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id? : string;
}> {}
const ItemEdit:React.FC<ItemEditProps> = ({history, match}) =>{
    const {items, saving, savingError, saveItem} = useContext(ItemContext);


    const [item, setItem] = useState<ItemProps>();
    useEffect( () =>{
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it.id == +routeId);
        setItem(item);
        if(item){
            // set text for inputs
        }

    },[match.params.id, items]);

    const handleSave = () => {};

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

               <IonLoading isOpen={saving} />
               {savingError && (
                   <div>{savingError.message || 'Failed to save item'}</div>
               )}

           </IonContent>


        </IonPage>
    )

}




export default ItemEdit;