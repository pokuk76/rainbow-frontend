// eslint-disable-next-line
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';

import BaseRouter from './routes';
import * as actions from './store/actions/auth';

import axios from "axios";

if (process.env.NODE_ENV !== "production") {
    axios.defaults.baseURL = "http://127.0.0.1:8000";
} else {
    if (process.env.IS_LOCAL_PRODUCTION_BUILD === "false") {
        axios.defaults.baseURL = `https://${process.env.PRODUCTION_HOST}`;
    } else {
        axios.defaults.baseURL = `http://${process.env.LOCAL_PRODUCTION_HOST}`;
    }
}

class App extends Component {

    componentDidMount = state => {
        /* TODO: This is where the random AUTH_FAIL action is coming from in the registration portal
           It's not really a big deal, and if we have it then I don't think we need to check localStorage for 
           isAuthenticated in the routes but let's think about that some more */
        this.props.authCheckState();
    }

    render() {
        return (
            <Router basename="/portals">
                <BaseRouter {...this.props} />
            </Router>
        );
    }
}

const mapStateToProps = state => {
    // console.log("App state: ", state);
    return {
        isAuthenticated: state.auth.token !== null,
        username: state.auth.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authCheckState: () => dispatch(actions.authCheckState()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
