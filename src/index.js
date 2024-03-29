import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import authReducer from './store/reducers/auth';
import guestReducer from './store/reducers/guest';
import formReducer from './store/reducers/form';
import adminReducer from './store/reducers/admin';

import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    auth: authReducer,
    guest: guestReducer, 
    form: formReducer,
    admin: adminReducer,
});

const store = createStore(reducer, composeEnhancer(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

if (process.env.NODE_ENV === "production") {
    ReactDOM.render(
        <React.StrictMode>
            {app}
        </React.StrictMode>,
        document.getElementById('root')
    );
} else {
    // Get rid of the "Warning: findDOMNode is deprecated in StrictMode." error (I think its from AntD)
    ReactDOM.render(
        app, document.getElementById('root')
    );
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

