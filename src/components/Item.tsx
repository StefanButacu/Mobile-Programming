import React from 'react';

import {getLogger} from "../core/utils";
import moment from "moment/moment";
import {ItemProps} from "./ItemProps";
import {IonItem} from "@ionic/react";

const log = getLogger("Item");
interface ItemPropsExt extends ItemProps{
    onEdit: (id?: number) => void;
}
const Item: React.FC<ItemPropsExt> =  ({id, foodName, price,dateBought, onSale, onEdit}) => {

    log(`returns`)
    return (
        <IonItem onClick={ () => onEdit(id)}>
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