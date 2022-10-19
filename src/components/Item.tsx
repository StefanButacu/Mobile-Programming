import React from 'react';

import {getLogger} from "../core/utils";
import ItemProps from "./customHooks/useItems";
import moment from "moment/moment";

const log = getLogger("Item");

// dd/mm/yyyy
const Item: React.FC<ItemProps> =  ({id, foodName, price,dateBought, onSale}) => {

    log(`render ${foodName}, ${price}, date= ${dateBought}, ${onSale}`)
    return (
        <div style={{border: "1px solid red"}}>
            <div>{foodName}</div>
            <div>{price}</div>
            <div> </div>
            {/*<div>{new Date(dateBought).toDateString()}</div>*/}
            <div>{moment(dateBought).format('DD-MM-YYYY')} </div>
            {/*<div>{new Date(dateBought).toString()} </div>*/}
            <div> { onSale ? 'on sale' : 'not on sale'}</div>
        </div>
    );
};

export default Item;