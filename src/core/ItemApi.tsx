import {authConfig, baseURL, config, getLogger, withLogs} from "./index";
import axios from "axios";
import {ItemProps} from "../components/ItemProps";
import {Plugins} from "@capacitor/core";

const log = getLogger('ItemApi');
const itemUrl = `http://${baseURL}/api/item`;

interface MessageData {
    event: string;
    payload: {
        item: ItemProps;
    };
}

export const newWebSocket = (token: string, onMessage: (data:MessageData) => void) =>{
    const ws = new WebSocket(`ws://${baseURL}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({type: 'authorization', payload :{token}}));
    }
    ws.onclose = () => {
        log('web socket onclose');
    }
    ws.onerror = error =>{
        log('websocket onerror', error.type);
    }
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => ws.close();

}

export const getItems: (token: string, searchText: string) => Promise<ItemProps[]> = (token) =>{
    return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps, networkStatus: any, present: any) => Promise<ItemProps[]> = (token,item, networkStatus, present) => {
    function offlineActionGenerator() {
        return new Promise<ItemProps[]>(async (resolve) => {
            const {Storage} = Plugins;
            present("Couldn't send data to the server, caching it locally", 3000);
            await Storage.set({
                key: `sav-${item.foodName}`,
                value: JSON.stringify({token, item})
            })
            // @ts-ignore
            resolve(item);
        });
    }
        if(networkStatus.connected){
            return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem').catch( () => {
                return offlineActionGenerator()
            });
        }
        return offlineActionGenerator();
}

export const updateItem: (token: string, item:ItemProps) => Promise<ItemProps[]> = (token, item) => {
    return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

