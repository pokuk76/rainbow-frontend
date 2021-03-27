// eslint-disable-next-line
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import 'antd/dist/antd.css';

import * as actions from './store/actions/auth';

import { connect } from 'react-redux';


class App extends Component {

  componentDidMount = state => {
    this.props.onTryAutoSignup();
  }


  render() {
    return (
      // <div>
      //   <Router>
      //     <Switch>
      //       <Route exact path={["/"]}>
      //         <CustomLayout {...this.props}>
      //           <BaseRouter />
      //         </CustomLayout>
      //       </Route>

      //       <Route exact path='/test'>
      //         <SiderDemo {...this.props}>
      //           <Route exact path='/test'/>
      //         </SiderDemo>
      //       </Route>
      //     </Switch>
          
      //   </Router>
      // </div>
      <Router>
        <BaseRouter {...this.props} />
      </Router>
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    username: state.username
  }
}

const mapDispatchToProps = dispatchEvent => {
  return {
    onTryAutoSignup: () => dispatchEvent(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
