import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import MessagePage from '../Message';

import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';

const App = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <AppBase firebase={firebase} />}
  </FirebaseContext.Consumer>
);
// const App = () => (
//   <div>
//     <AppBase />
//   <div/>
// );

class AppBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        console.log(authUser);
        // authUser
        //   ? console.log('islogin')
        //   : console.log('nologin')
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render() {
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <div className='main'>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.MESSAGE} component={MessagePage} />
          </div>
        </Router>
      </AuthUserContext.Provider>
    )
  }
}
export default App;
// export default withFirebase(App);