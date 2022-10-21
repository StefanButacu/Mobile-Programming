import {getLogger} from "../core/utils";
import axios from "axios";
import {ItemProps} from "../components/ItemProps";

const log = getLogger('ItemApi');
const baseURL = 'http://localhost:3000';
const itemUrl = `${baseURL}/item`;

interface ResponseProps<T>{
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, functionName: string) : Promise<T> {
    log(`${functionName} - started`);
    return promise
        .then(res =>{
            log(`${functionName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${functionName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export const getItems: () => Promise<ItemProps[]> = () =>{
    return withLogs(axios.get(itemUrl, config), 'getItems');
}

export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
    return withLogs(axios.post(itemUrl, item, config), 'createItem');
}

export const updateItem: (item:ItemProps) => Promise<ItemProps[]> = item =>{
    return withLogs(axios.put(`${itemUrl}/${item.id}`, item, config),  'updateItem');

}