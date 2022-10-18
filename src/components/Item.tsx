import React from 'react';

import {getLogger} from "../core/utils";
import ItemProps from "./customHooks/addItem";

const log = getLogger("Item");

// dd/mm/yyyy
const Item: React.FC<ItemProps> =  ({id, foodName, price,dateBought, onSale}) => {

    log(`render ${foodName}, ${price}, date= ${dateBought}, ${onSale}`)
    return (
        <div style={{border: "1px solid red"}}>
            <div>{foodName}</div>
            <div>{price}</div>
            <div> </div>
            <div>{new Date(dateBought).toDateString()}</div>
            <div> { onSale ? 'on sale' : 'not on sale'}</div>
        </div>
    );
};

export default Item;