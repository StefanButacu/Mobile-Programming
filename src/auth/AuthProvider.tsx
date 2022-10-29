import React, {useCallback, useEffect, useState} from 'react';
import {getLogger} from "../core";
import PropTypes from "prop-types";
import {login as loginApi} from './authApi';

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;


export interface AuthState{
    isAuthenticated: boolean,
    isAuthenticating: boolean,
    authenticationError: Error | null,
    pendingAuthentication?: boolean,
    username?: string,
    password?: string,
    login?: LoginFn,
    token: string,
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
}
export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps{
    children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) =>{
    const [state, setState] = useState<AuthState>(initialState);
    const {isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token} = state;
    const login = useCallback<LoginFn>(loginCallback, []);
    useEffect(authenticationEffect, [pendingAuthentication])
    const value = {isAuthenticated, login, isAuthenticating, authenticationError, token};
    log('render')
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )

    function authenticationEffect() {
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate(){
            if(!pendingAuthentication){
                log('authenticate, !pendingAuthentication return');
                return;
            }
            try{
                log("authenticate...");
                setState({...state, isAuthenticating: true});
                const {username, password} = state;
                const {token} = await loginApi(username, password);
                if(canceled)
                    return;
                setState({...state,
                token,
                pendingAuthentication: false,
                isAuthenticated: true,
                isAuthenticating: false
                })

            }catch (err) {
                if (canceled) {
                    return;
                }
                log('authenticate failed');
                setState({
                    ...state,
                    // @ts-ignore
                    authenticationError: err,
                    isAuthenticating: false,
                    isAuthenticated: false,
                })
            }

        }
    }

    function loginCallback(username?: string, password?: string): void{
        log('login');
        setState({
            ...state,
            pendingAuthentication: true,
            username,
            password
        })
    }


};