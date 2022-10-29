import axios from "axios";
import {baseURL, config, withLogs} from '../core';


const authUrl = `http://${baseURL}/api/auth/login`;

export interface AuthProps{
    token: string;
}

export const login: (username?: string, password?: string) => Promise<AuthProps> = (username, password) =>{
    return withLogs(axios.post(authUrl, {username, password}, config), 'login');
}