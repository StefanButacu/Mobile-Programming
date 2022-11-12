import React from 'react';
import {useAppState} from "./useAppState";
import {useNetwork} from "./useNetwork";
import {useBackgroundTask} from "./useBackgroundTask";
import {IonItem} from "@ionic/react";


export const NetworkState: React.FC = () => {
    const {appState} = useAppState();
    const {networkStatus} = useNetwork();
    useBackgroundTask( () => new Promise(resolve => {
        console.log('My background Task');
        resolve();
    }));
    return (
        <div>
            {
                networkStatus.connected &&
                <IonItem>
                    Connected
                </IonItem>
            }
            {   !networkStatus.connected &&
                <IonItem>
                    Not Connected
                </IonItem>
            }

    </div>)
}