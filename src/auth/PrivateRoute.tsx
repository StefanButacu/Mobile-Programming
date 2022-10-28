import React, {useContext} from 'react';
import {getLogger} from "../core";
import PropTypes from "prop-types";
import {AuthContext, AuthState} from "./AuthProvider";
import {Redirect, Route} from "react-router-dom";


const log = getLogger('Login');

export interface PrivateRouteProps{
    component: PropTypes.ReactComponentLike,
    path: string,
    exact?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, ...rest}) =>{
    const {isAuthenticated} = useContext<AuthState>(AuthContext);
    log('render, isAuthenticated', isAuthenticated);
    /// TODO - console log props for router with path parameters
    return (
        <Route {...rest} render={props => {
            console.log('Route props', props);
            if(isAuthenticated){
                return <Component {...props} />;
            }
            return <Redirect to={{ pathname: '/login' }} />
        }} />
    );

}