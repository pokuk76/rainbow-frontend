import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import SchoolList from './containers/AdminApp/SchoolListView';
import SchoolDetail from './containers/AdminApp/SchoolDetailView';
import GuestList from './containers/AdminApp/GuestListView';
import GuestDetail from './containers/AdminApp/GuestDetail';
import Login from './containers/AdminApp/Login';

import CustomLayout from './containers/AdminApp/Layout';
import GuestLayout from './containers/UserApp/LayoutGuest';


const BaseRouter = (props) => (
        <Switch>
            <Route exact path='/school' render={matchProps => <CustomLayout {...matchProps} ><SchoolList /></CustomLayout>} />
            <Route exact path='/school/:schoolID' render={matchProps => <CustomLayout {...matchProps} ><SchoolDetail /></CustomLayout>} />
            <Route exact path='/admin' render={matchProps => <CustomLayout {...matchProps} ><GuestList {...matchProps} /></CustomLayout>} />
            <Route exact path='/admin/:guestID' render={ matchProps => {
                console.log(matchProps.location.pathname);
                console.log(props);
                const redirectAfterLogin = matchProps.location.pathname;
                return <CustomLayout {...matchProps} >
                    { localStorage.getItem('isAuthenticated') ? 
                        <GuestDetail {...matchProps} isAuthenticated={props.isAuthenticated} /> 
                        : <Redirect to={{
                            pathname: `/login`, 
                            state: { referrer: redirectAfterLogin}
                          }} />
                    }
                </CustomLayout>}
            } />
            <Route exact path='/test/:randomNum' render={matchProps => {
                console.log(matchProps);
                return <h1>Testing...</h1>;
            }} />
            
            {/* <Route exact path='/portal/admin/:guestID' render={matchProps => <CustomLayout {...matchProps} ><GuestDetail {...matchProps} isAuthenticated={props.isAuthenticated} /></CustomLayout>} /> */}
            <Route path='/login' render={matchProps => <CustomLayout {...matchProps} ><Login {...matchProps} /></CustomLayout>} />

            <Route exact path='/registration' render={matchProps => <GuestLayout {...matchProps} ></GuestLayout>} />
            <Route exact path='/registration/success' render={matchProps => <div {...matchProps} ><h1>Submit Successful</h1></div>} />

        </Switch>
        
    );

export default BaseRouter;