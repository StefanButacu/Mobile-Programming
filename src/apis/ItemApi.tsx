import {baseURL, config, getLogger, withLogs} from "../core";
import axios from "axios";
import {ItemProps} from "../components/ItemProps";

const log = getLogger('ItemApi');
const itemUrl = `http://${baseURL}/item`;

interface MessageData {
    event: string;
    payload: {
        item: ItemProps;
    };
}

export const newWebSocket = (onMessage: (data:MessageData) => void) =>{
    const ws = new WebSocket(`ws://${baseURL}`);
    ws.onopen = () => {
        log('web socket onopen');
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

export const getItems: () => Promise<ItemProps[]> = () =>{
    return withLogs(axios.get(itemUrl, config), 'getItems');
}

export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
    return withLogs(axios.post(itemUrl, item, config), 'createItem');
}

export const updateItem: (item:ItemProps) => Promise<ItemProps[]> = item =>{
    return withLogs(axios.put(`${itemUrl}/${item.id}`, item, config),  'updateItem');

}

