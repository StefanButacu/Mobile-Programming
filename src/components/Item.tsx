import React from 'react';

import {getLogger} from "../core/utils";

const log = getLogger("Item");
interface ItemProps {
    id?: string;
    foodName: string;
    price: number;
    dateBought: Date;
    onSale: boolean;
}
// dd/mm/yyyy
const Item: React.FC<ItemProps> =  ({id, foodName, price, dateBought, onSale}) => {

    log(`render ${foodName}, ${price}, ${onSale}`)
    return (
        <>
            <div> This is an item </div>
            <div>{foodName}</div>
            <div>{price}</div>
            <div>{dateBought.toDateString()}</div>
            <div> { onSale ? 'on sale' : 'not on sale'}</div>
        </>
    );
};

export default Item;