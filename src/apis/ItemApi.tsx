import {getLogger} from "../core/utils";
import ItemProps from "../components/customHooks/useItems";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const log = getLogger('ItemApi');
const baseURL = 'http://localhost:3000';

export const getItems: () => Promise<ItemProps[]> = () =>{
    log('getItems -started');
    return axios
        .get(`${baseURL}/item`)
        .then(res =>{
            log('getItems - succeeded');
            return Promise.resolve(res.data);
        })
        .catch(err =>{
            log('getItems-failed');
            return Promise.reject(err);
        });


}