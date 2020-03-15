import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import MessagePage from '../Message';
import ProfilePage from '../Profile';
import NotFoundPage from '../NotFound';
import Loading from '../img/loading.gif';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';

const App = () => (
  <FirebaseContext.Consumer>
    {(firebase) => <AppBase firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class AppBase extends Component {
  constructor(props) {
    super(props);
    this.updateUserData = (updateObject) => {
      this.setState(updateObject);
    };

    this.state = {
      authUser: "",
      userInfo: '',
      updateUserData: this.updateUserData,
      friendInvitation: ''
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        console.log(authUser);
        if (authUser) {
          // snpashot method
          this.props.firebase.db.collection("Users").doc(authUser.uid)
            .onSnapshot(
              (doc) => {
                if (doc.exists) {
                  this.setState({ authUser: authUser, userInfo: doc.data() });
                } else {
                  console.log("No such document!");
                }
              },
              (error) => {
                console.log(error)
              }
            )
          this.props.firebase.db.collection("Users").doc(authUser.uid)
            .update(
              { timestamp: Date.now() }
            )
          this.props.firebase.db.collection("Users").doc(authUser.uid).collection("friends")
            .where("status", "==", "askUrConfirm")
            .onSnapshot(
              (querySnapshot) => {
                let count = 0;
                querySnapshot.forEach(function (doc) {
                  if (doc) {
                    count += 1;
                  }
                });
                // console.log(count);
                this.setState({ friendInvitation: count });
              }
            )
        }
        else {
          this.setState({ authUser: null });
        }
      },
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render() {
    return (
      <AuthUserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.ACCOUNT} render={() => {
              if (this.state.authUser === "") {
                return (<div className="loading"><img src={Loading} alt="Loading" /></div>)
              } else if (this.state.authUser === null) {
                return (<LandingPage />)
              } else {
                return (<AccountPage />)
              }
            }} />
            <Route path={ROUTES.HOME} render={() => {
              if (this.state.authUser === "") {
                return (<div className="loading"><img src={Loading} alt="Loading" /></div>)
              } else if (this.state.authUser === null) {
                return (<LandingPage />)
              } else {
                return (<HomePage />)
              }
            }} />
            <Route path={ROUTES.MESSAGE} render={() => {
              if (this.state.authUser === "") {
                return (<div className="loading"><img src={Loading} alt="Loading" /></div>)
              } else if (this.state.authUser === null) {
                return (<LandingPage />)
              } else {
                return (<MessagePage />)
              }
            }} />
            <Route path={ROUTES.PROFILE} render={() => {
              if (this.state.authUser === "") {
                return (<div className="loading"><img src={Loading} alt="Loading" /></div>)
              } else if (this.state.authUser === null) {
                return (<LandingPage />)
              } else {
                return (<ProfilePage />)
              }
            }} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </Router>
      </AuthUserContext.Provider>
    )
  }
}
export default App;