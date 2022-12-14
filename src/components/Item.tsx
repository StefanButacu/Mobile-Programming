import React, {useCallback, useState} from 'react';

import {getLogger} from "../core";
import moment from "moment/moment";
import {ItemProps} from "./ItemProps";
import {IonButton, IonCard, IonItem, IonLabel, IonTitle} from "@ionic/react";
import {usePhotoGallery} from "./photo/usePhoto";
import {MapModal} from "./map/modal/MapModal";
import {MyMap} from "./map/MyMap";

const log = getLogger("Item");
interface ItemPropsExt extends ItemProps{
    onEdit: (_id?: string) => void;
}
const Item: React.FC<ItemPropsExt> =  ({_id, foodName, price,dateBought, onSale, latitude, longitude, onEdit}) => {
    const handleEdit = useCallback(() => onEdit(_id), [_id, onEdit])
    const {photos} = usePhotoGallery();
    let filteredPhotos = photos.filter(it => it.filepath.startsWith(`${foodName}=>`))
    const [showMap, setShowMap] = useState<boolean>(false);

    return (
        <IonCard>
            <IonTitle>
                {foodName}
            </IonTitle>
            {
                filteredPhotos.map(photo =>
                    <img height="200px"
                         key = {photo!!.webviewPath}
                         src={photo!!.webviewPath}
                         alt="meal"
                    />
                )
            }
            <br/>
            <IonLabel>Price: {price}</IonLabel>
            <br />
            <IonLabel>Date bought: {moment(dateBought).format('DD-MM-YYYY')}</IonLabel>

                <div> { onSale ? 'on sale' : 'not on sale'}</div>
            <IonButton onClick={() => onEdit(_id)}>Edit</IonButton>
            {latitude && longitude &&
                <MapModal latitude={latitude} longitude={longitude}/>
            }
        </IonCard>
    );
};

export default Item;