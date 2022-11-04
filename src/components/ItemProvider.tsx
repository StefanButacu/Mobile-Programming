import React, {ReactNode, useCallback, useContext, useEffect, useReducer} from 'react'
import {getLogger} from "../core";
import {createItem, getItems, newWebSocket, updateItem} from "../core/ItemApi";
import {ItemProps} from "./ItemProps";
import PropTypes from 'prop-types';
import {AuthContext} from "../auth/AuthProvider";
import {useNetwork} from "./useNetwork";
import {Plugins} from "@capacitor/core";
import {constructOutline, help} from "ionicons/icons";

const log= getLogger('itemProvider');
type SaveItemFn = (item:ItemProps) => Promise<any>;

export interface ItemsState {
    items?: ItemProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveItem?: SaveItemFn,
}

interface ActionProps{
    type: string,
    payload?: any,
}

const initialState: ItemsState = {
    fetching: false,
    saving: false,
}


export const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
export const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
export const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
export const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
export const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
export const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState = (state, {type,payload}) =>{

    switch (type){
        case FETCH_ITEMS_STARTED:
            return {...state, fetching: true};
        case FETCH_ITEMS_SUCCEEDED:
            return {...state,items: payload.items, fetching: false};
        case FETCH_ITEMS_FAILED:
            return {...state, fetchingError: payload.error, fetching: false};
        case SAVE_ITEM_STARTED:
            return {...state, savingError: null, saving: true};
        case SAVE_ITEM_SUCCEEDED:
            const items = [...(state.items || [])];
            const item = payload.item;
            const index = items.findIndex(it => it._id === item._id);
            if(index === -1){
                items.splice(0,0, item);
            }else{
                items[index] = item;
            }
            return {...state, items, saving:false};

        case SAVE_ITEM_FAILED:
            return {...state, savingError: payload.error, saving: false};
        default:
            return state;
    }
}

export const ItemContext = React.createContext<ItemsState>(initialState);


interface ItemProviderProps{
    children: PropTypes.ReactNodeLike;
}
export const ItemProvider: React.FC<ItemProviderProps> = ( { children } ) =>{
    const {token} = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const {items, fetching, fetchingError, saving, savingError} = state;
    const {networkStatus} = useNetwork();
    useEffect(getItemsEffect, [token]);
    useEffect(wsEffect, [token]);
    useEffect(executePendingOperations, [networkStatus.connected, token]);
    const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
    const value = {items, fetching, fetchingError, saving, savingError, saveItem};
    log('returns');
    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );

    function getItemsEffect() {
        let canceled = false;
        fetchItems();
        return () => {
            canceled = true;
        }

        async function fetchItems() {
            if(!token?.trim())
                return;
            try{
                log('fetchItems started');
                dispatch({type:FETCH_ITEMS_STARTED});
                const items = await getItems(token);
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
    }

    function executePendingOperations(){
        async function helperMethod(){
            if(networkStatus.connected && token?.trim()){
                log('executing pending operations')
                const {Storage} = Plugins;
                const {keys} = await Storage.keys();
                for(const key of keys) {
                    if(key.startsWith("sav-")){
                        const res = await Storage.get({key: key});
                        if (typeof res.value === "string") {
                            const value = JSON.parse(res.value);
                            log('creating item from pending', value);
                            await createItem(value.token, value.item, networkStatus)
                            await Storage.remove({key: key});
                        }
                    }
                }
            }
        }
        helperMethod();


    }

    async function saveItemCallback(item: ItemProps){
        try{
            log('saveItem started');
            dispatch({type: SAVE_ITEM_STARTED});
            const savedItem = await (item._id ? updateItem(token, item) : createItem(token, item, networkStatus));
            log('saveItem succeeded');
            dispatch({type:SAVE_ITEM_SUCCEEDED, payload: {item: savedItem}} );
        }catch (error){
            log('saveItem failed');
            dispatch({type: SAVE_ITEM_FAILED, payload: {error}});
        }
    }
    function wsEffect(){
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if(token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const {event, payload: {item}} = message;
                log(`ws message, item ${event}`);
                if (event === 'created' || event === 'update') {
                    dispatch({type: SAVE_ITEM_SUCCEEDED, payload: {item}});
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
}