import React, {useCallback, useEffect, useState} from 'react';
import {getLogger} from "../../core/utils";
import {getItems} from "../../apis/ItemApi";

const log = getLogger('useItems');

export interface ItemProps {
    id?: number;
    foodName: string;
    price: number;
    dateBought: string;
    onSale: boolean;
}

export interface ItemsState {
    items?: ItemProps[],
    fetching: boolean,
    fetchingError?: Error,

}
export interface ItemsProps extends ItemsState{
    addItem: () => void
}

export const useItems: () => ItemsProps = () => {
    const [fetching, setFetching] = useState<boolean>(false);
    const [items, setItems] = useState<ItemProps[]>([]
    );
    const [fetchingError, setFetchingError] = useState<Error>();
    const addItem = useCallback(() => {
        log('addItem - TODO');
    }, []);


    useEffect(getItemsEffect, []);
    log(`returns - fetching= ${fetching}, items=${JSON.stringify(items)}`);
    return {
        items,
        fetching,
        fetchingError,
        addItem
    }

    function getItemsEffect() {
        let canceled = false;

        async function fetchItems() {
            try{
                log('fetchItems started');
                setFetching(true);
                const items = await getItems();
                log('fetchingItems succeded');
                if(!canceled) {
                    setFetching(false);
                    setItems(items);
                }
            }catch (err){
                log('fetchItems failed');
                if (!canceled){
                    setFetching(false);
                    setFetchingError(err as Error);
                }
            }
        }

        fetchItems();
        return () => {
            canceled = true;
        }
    }
}

export default ItemProps;