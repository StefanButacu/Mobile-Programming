import {RouteComponentProps} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {ItemContext} from "./ItemProvider";
import {
    IonActionSheet,
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon,
    IonInput, IonItem, IonLabel,
    IonLoading,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {ItemProps} from "./ItemProps";
import {getLogger} from "../core";
import {NetworkState} from "./NetworkState";
import {AuthContext} from "../auth/AuthProvider";
import {Photo, usePhotoGallery} from "./photo/usePhoto";
import {camera, closeCircle, trash} from "ionicons/icons";

const log = getLogger('itemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id? : string;
}> {}

const ItemEdit:React.FC<ItemEditProps> = ({history, match}) =>{
    const {items, saving, savingError, saveItem} = useContext(ItemContext);
    const {token} = useContext(AuthContext);
    const {photos, takePhoto, deletePhoto} = usePhotoGallery(token);

    const [item, setItem] = useState<ItemProps>();
    const [foodName, setFoodName] = useState('');
    const [price, setPrice] = useState(0);
    const [dateBought, setDateBought] = useState(new Date());
    const [onSale, setOnSale] = useState(true);
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();
    const handleBack = () => {
        history.goBack()
    }
    useEffect( () =>{
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it._id == routeId);
        setItem(item);
        if(item){
            setFoodName(item.foodName);
            setPrice(item.price);
            setDateBought(new Date(Date.parse(item.dateBought.toString())));
            setOnSale(item.onSale)
        }

    },[match.params.id, items]);
    const handleSave = () => {
        const editedItem = item ? {...item, foodName, price, dateBought, onSale} : {foodName, price, dateBought , onSale };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };
    let filteredPhotos = photos.filter(it => it.filepath.startsWith(`${foodName}=>`))

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <NetworkState/>
                    <IonButtons slot="end" >
                        <IonButton onClick={handleBack}>
                            Back
                        </IonButton>
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
                        setOnSale(!onSale);}}>

                    </IonCheckbox>
               </IonItem>
                   <div>
                       {
                           filteredPhotos.map(photo =>
                               <img height="300px"
                                    key={photo!!.webviewPath}
                                    src={photo!!.webviewPath}
                                    onClick={() => setPhotoToDelete(photo)}
                                    alt="food"
                               />
                           )
                       }
                   </div>

               <IonLoading isOpen={saving} />
               {savingError && (
                   <div>{savingError.message || 'Failed to save item'}</div>
               )}
               <IonFab vertical="bottom" horizontal="center" slot="fixed">
                   <IonFabButton onClick={() => {
                       takePhoto(foodName)
                   }}>
                       <IonIcon icon={camera}/>
                   </IonFabButton>
               </IonFab>

           </IonContent>
            <IonActionSheet
                isOpen={!!photoToDelete}
                buttons={[{
                    text: 'Delete',
                    role: 'destructive',
                    icon: trash,
                    handler: () => {
                        if (photoToDelete) {
                            deletePhoto(photoToDelete).then(_ => {
                            });
                            setPhotoToDelete(undefined);
                        }
                    }
                }, {
                    text: 'Cancel',
                    icon: closeCircle,
                    role: 'cancel'
                }]}
                onDidDismiss={() => setPhotoToDelete(undefined)}
            />
        </IonPage>
    )

}

export default ItemEdit;