import {useEffect} from "react";
import { Plugins } from '@capacitor/core';

const {BackgroundTask } = Plugins;

export const useBackgroundTask = (asyncTask: () => Promise<void>) =>{
    useEffect( ()=> {
        let taskId = BackgroundTask.beforeExit(async () => {
            console.log('useBackgroundTask - executeTask started');
            await asyncTask();
            console.log('useBackgorundTask - executeTask finished');
            BackgroundTask.finish({taskId});
        });
    }, []);
    return {};
}
