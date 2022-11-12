
import {useEffect, useState} from "react";
import {Plugins} from "@capacitor/core";
import {AppState} from "@capacitor/core";

const {App} = Plugins;

const initialState = {
    isActive: true,
}
export const useAppState = () => {
    const [appState, setAppState] = useState(initialState);
    useEffect( () => {
            const handler = App.addListener('appStateChange', handleAppStateChange);
            App.getState().then(handleAppStateChange);
            let canceled = false;
            return () => {
                canceled = false;
                // handler.remove();
            }

            function handleAppStateChange(state: AppState) {
                if (!canceled) {
                    setAppState(state);
                }
            }
        }, [])
    return {appState};

}