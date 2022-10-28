import React, {useCallback, useState} from 'react';
import {getLogger} from "../core";
import PropTypes from "prop-types";


const log = getLogger('AuthProvider');

type LoginFn = () => Promise<any>;


export interface AuthState{
    isAuthenticated: boolean,
    login?: LoginFn
}

const initialState: AuthState = {
    isAuthenticated: false,
}
export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps{
    children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) =>{
    const [{isAuthenticated}, setAuthenticated] = useState<AuthState>(initialState);

    function loginCallback(): Promise<any> {
        log('login');
        setAuthenticated({isAuthenticated: true});
        return Promise.resolve();
    }

    const login = useCallback<LoginFn>(loginCallback, []);
    const value = {isAuthenticated, login};
    log('render')

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )

};