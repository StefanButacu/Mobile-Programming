import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {getLogger} from "../../core/utils";
import {getItems} from "../../apis/ItemApi";

const log = getLogger('useItems');

export interface ItemProps {
    id?: number;
    foodName: string;
    price: number;
    dateBought: Date;
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
interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: ItemsState = {
    items: undefined,
    fetching: false,
    fetchingError: undefined,
}

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState = (state, {type,payload}) =>{

    switch (type){
        case FETCH_ITEMS_STARTED:
            return {...state, fetching: true};
        case FETCH_ITEMS_SUCCEEDED:
            return {...state,items: payload.items, fetching: false};
        case FETCH_ITEMS_FAILED:
            return {...state, fetchingError: payload.error, fetching: false};
        default:
            return state;
    }
}

export const useItems: () => ItemsProps = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const {items, fetching, fetchingError} = state;
    const addItem = useCallback(() => {
        log('addItem - TODO');
    }, []);
    useEffect(getItemsEffect, [dispatch]);

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
                dispatch({type:FETCH_ITEMS_STARTED});
                const items = await getItems();
                log('fetchingItems succeded');
                if(!canceled) {
                    dispatch({type:FETCH_ITEMS_SUCCEEDED, payload: {items} } );
                }
            }catch (err){
                log('fetchItems failed');
                if (!canceled){
                dispatch({type:FETCH_ITEMS_FAILED, payload: {err}})
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