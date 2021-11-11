import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import SchoolList from './AdminApp/containers/SchoolListView';
import SchoolDetail from './AdminApp/containers/SchoolDetailView';
import GuestList from './AdminApp/containers/GuestListView';
import GuestDetail from './AdminApp/containers/GuestDetail';
import Login from './AdminApp/containers/Login';

import CustomLayout from './AdminApp/containers/Layout';
import GuestLayout from './GuestApp/containers/Layout';


const BaseRouter = (props) => (
    <Switch>
        <Route exact path='/' render={matchProps => <div><h1>Landing</h1></div>} />
        <Route path='/login' 
            render={ matchProps => {
                const redirectFromLogin = matchProps.location.pathname;
                return localStorage.getItem('isAuthenticated')  
                ? <Redirect to={{
                    pathname: `/admin`,
                    state: { referrer: redirectFromLogin }
                }} />
                : <Login {...matchProps} /> ;
            }}
        />
        <Route exact path='/school' render={matchProps => <CustomLayout {...matchProps} ><SchoolList /></CustomLayout>} />
        <Route exact path='/school/:schoolID' render={matchProps => <CustomLayout {...matchProps} ><SchoolDetail /></CustomLayout>} />
        <Route exact path='/admin'
            render={matchProps => {
                const redirectAfterLogin = matchProps.location.pathname;
                console.log("isAuthenticated?", props.isAuthenticated);
                console.log('local storage', localStorage.getItem('isAuthenticated'))
                return (
                    // localStorage.getItem('isAuthenticated') 
                    props.isAuthenticated
                    ? <CustomLayout {...matchProps} component={(props) => <GuestList {...props} />} />
                    : <Redirect to={{
                        pathname: `/login`,
                        state: { referrer: redirectAfterLogin }
                    }} />
                );
            }}
        />
        
        {/* Looks  a bit ugly but it works ¯\_( ͡° ͜ʖ ͡°)_/¯ */}
        <Route exact path='/admin/:guestID' 
            render={ matchProps => {
                console.log(matchProps.location.pathname);
                console.log(props);
                const redirectAfterLogin = matchProps.location.pathname;
                // return localStorage.getItem('isAuthenticated') 
                return props.isAuthenticated
                    ? <CustomLayout {...matchProps} >
                        <GuestDetail {...matchProps} isAuthenticated={props.isAuthenticated} />
                    </CustomLayout>
                    : <Redirect to={{
                        pathname: `/login`,
                        state: {referrer: redirectAfterLogin},
                    }} /> ;
                }
            }
        />
        <Route exact path='/test/:randomNum' render={matchProps => {
            console.log(matchProps);
            return <h1>Testing...</h1>;
        }} />

        <Route exact path='/registration' render={matchProps => <GuestLayout {...matchProps} ></GuestLayout>} />
        <Route exact path='/registration/success' render={matchProps => <div {...matchProps} ><h1>Submit Successful</h1></div>} />

    </Switch>
    
);

export default BaseRouter;