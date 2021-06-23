// eslint-disable-next-line
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';

import * as actions from './store/actions/auth';

import { connect } from 'react-redux';

import axios from "axios";

if (window.location.origin === "http://localhost:3000") {
  axios.defaults.baseURL = "http://127.0.0.1:8000";
  // let one = 1;
} else {
  axios.defaults.baseURL = window.location.origin;
}

class App extends Component {

  componentDidMount = state => {
    /* TODO: This is where the random AUTH_FAIL action is coming from in the registration portal
       It's not really a big deal, and if we have it then I don't think we need to check localStorage for 
       isAuthenticated in the routes but let's think about that some more */
    // this.props.onTryAutoSignup();
  }


  render() {
    return (
      <Router basename="/portal">
        <BaseRouter {...this.props} />
      </Router>
    );
  }

}

const mapStateToProps = state => {
  console.log("App state: ", state);
  return {
    isAuthenticated: state.auth.token !== null,
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatchEvent => {
  return {
    onTryAutoSignup: () => dispatchEvent(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
