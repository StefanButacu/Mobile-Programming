import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {ItemList} from './components/ItemList';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {ItemProvider} from "./components/ItemProvider";
import ItemEdit from "./components/ItemEdit";
import {PrivateRoute} from "./auth/PrivateRoute";
import {AuthProvider} from "./auth/AuthProvider";
import {Login} from "./auth/Login";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
         <AuthProvider>
             <Route exact={true} path="/login" component={Login} />
            <ItemProvider>
                <PrivateRoute exact ={true} path="/items" component={ItemList} />
                <PrivateRoute exact ={true} path="/item" component={ItemEdit} />
                <PrivateRoute exact ={true} path="/item/:id" component={ItemEdit}  />
            </ItemProvider>
            <Route exact path="/" render={() => <Redirect to="/items" />}    />
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>

  </IonApp>
);

export default App;
