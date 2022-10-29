import {authConfig, baseURL, config, getLogger, withLogs} from "../core";
import axios from "axios";
import {ItemProps} from "../components/ItemProps";

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

export const getItems: (token: string) => Promise<ItemProps[]> = (token) =>{
    return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token,item) => {
    return withLogs(axios.post(itemUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item:ItemProps) => Promise<ItemProps[]> = (token, item) => {
    return withLogs(axios.put(`${itemUrl}/${item._id}`, item, authConfig(token)), 'updateItem');
}

