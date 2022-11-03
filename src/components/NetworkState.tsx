import React from 'react';
import {useAppState} from "./useAppState";
import {useNetwork} from "./useNetwork";
import {useBackgroundTask} from "./useBackgroundTask";


export const NetworkState: React.FC = () => {
    const {appState} = useAppState();
    const {networkStatus} = useNetwork();
    useBackgroundTask( () => new Promise(resolve => {
        console.log('My background Task');
        resolve();
    }));
    return (<div>
        <div>App state is {JSON.stringify(appState)}</div>
        <div>Network status is {JSON.stringify(networkStatus)}</div>

    </div>)
}