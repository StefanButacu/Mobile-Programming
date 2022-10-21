export {};
// import React, {useCallback, useEffect, useReducer, useState} from 'react';
// import {getLogger} from "../../core/utils";
// import {getItems} from "../../apis/ItemApi";
//
// const log = getLogger('useItems');
//
// export interface ItemsProps extends ItemsState{
//     addItem: () => void
// }
//
//
//
// export const useItems: () => ItemsProps = () => {
//
//     const [state, dispatch] = useReducer(reducer, initialState);
//     const {items, fetching, fetchingError} = state;
//     const addItem = useCallback(() => {
//         log('addItem - TODO');
//     }, []);
//     useEffect(getItemsEffect, [dispatch]);
//
//     log(`returns - fetching= ${fetching}, items=${JSON.stringify(items)}`);
//     return {
//         items,
//         fetching,
//         fetchingError,
//         addItem
//     }
//
//     function getItemsEffect() {
//         let canceled = false;
//
//         async function fetchItems() {
//             try{
//                 log('fetchItems started');
//                 dispatch({type:FETCH_ITEMS_STARTED});
//                 const items = await getItems();
//                 log('fetchingItems succeded');
//                 if(!canceled) {
//                     dispatch({type:FETCH_ITEMS_SUCCEEDED, payload: {items} } );
//                 }
//             }catch (err){
//                 log('fetchItems failed');
//                 if (!canceled){
//                 dispatch({type:FETCH_ITEMS_FAILED, payload: {err}})
//                 }
//             }
//         }
//
//         fetchItems();
//         return () => {
//             canceled = true;
//         }
//     }
// }
//
// export default ItemProps;