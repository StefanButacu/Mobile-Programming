import React, {useCallback} from 'react';

import {getLogger} from "../core";
import moment from "moment/moment";
import {ItemProps} from "./ItemProps";
import {IonItem} from "@ionic/react";

const log = getLogger("Item");
interface ItemPropsExt extends ItemProps{
    onEdit: (_id?: string) => void;
}
const Item: React.FC<ItemPropsExt> =  ({_id, foodName, price,dateBought, onSale, onEdit}) => {
    // const handleEdit = useCallback(() => onEdit(_id), [_id, onEdit])
    // onClick={handleEdit}
    return (
        <IonItem >
            <div style={{border: "1px solid red"}}>
                <div>{foodName}</div>
                <div>{price}</div>
                <div> </div>
                {/*<div>{new Date(dateBought).toDateString()}</div>*/}
                <div>{moment(dateBought).format('DD-MM-YYYY')} </div>
                {/*<div>{new Date(dateBought).toString()} </div>*/}
                <div> { onSale ? 'on sale' : 'not on sale'}</div>
            </div>
        </IonItem>
    );
};

export default Item;