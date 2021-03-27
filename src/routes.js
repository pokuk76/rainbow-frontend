import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SchoolList from './containers/SchoolListView';
import SchoolDetail from './containers/SchoolDetailView';
import GuestList from './containers/GuestListView';
import GuestDetail from './containers/GuestDetailView';
import Login from './containers/Login';

import CustomLayout from './containers/Layout';
import GuestLayout from './containers/LayoutGuest';


const BaseRouter = () => (
    <div>
        <Switch>
            <Route exact path='/school' render={matchProps => <CustomLayout {...matchProps} ><SchoolList /></CustomLayout>} />
            <Route exact path='/school/:schoolID' render={matchProps => <CustomLayout {...matchProps} ><SchoolDetail /></CustomLayout>} />
            <Route exact path='/guests' render={matchProps => <CustomLayout {...matchProps} ><GuestList {...matchProps} /></CustomLayout>} />
            <Route exact path='/guests/:guestID' render={matchProps => <CustomLayout {...matchProps} ><GuestDetail {...matchProps} /></CustomLayout>} />
            <Route exact path='/login' render={matchProps => <CustomLayout {...matchProps} ><Login {...matchProps} /></CustomLayout>} />

            <Route exact path='/test' render={matchProps => <GuestLayout {...matchProps} ></GuestLayout>} />
            <Route exact path='/test/success' render={matchProps => <div {...matchProps} ><h1>Submit Successful</h1></div>} />

        </Switch>
        
    </div>
);

export default BaseRouter;