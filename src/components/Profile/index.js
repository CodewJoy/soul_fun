/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Select from 'react-select'
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import ShowProfile from './show_profile';
import Edit from './edit';
import './profile.css';
import Navbar from '../Header';
import SignOutButton from '../LogOut';
import Loading from '../img/loading.gif';

const Profile = () => (
  <>
    <AuthUserContext.Consumer>
      {(userData) => (
        <FirebaseContext.Consumer>
          {(firebase) => <ProfileBase userData={userData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

class ProfileBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'show-profile'
    }
    this.sideNav = this.sideNav.bind(this);
  }
  sideNav(name) {
    this.setState({ selected: name });
  }
  render() {
    return (
      <div className="profile">
        <Navbar />
        <div className="main">
          <ul className="sideNav">
            <Link to='/profile' className={this.state.selected === 'show-profile' ? "active" : "none"} onClick={() => this.sideNav('show-profile')}>
              <li>
                Profile
              </li>
            </Link>
            <Link to='/profile/edit' className={this.state.selected === 'edit-profile' ? "active" : "none"} onClick={() => this.sideNav('edit-profile')}>
              <li>
                Edit
              </li>
            </Link>
            <a className={this.state.selected === 'log-out' ? "active" : "none"} onClick={() => this.sideNav('log-out')}>
              <li>
                <SignOutButton />
              </li>
            </a>
          </ul>
          <Switch>
            <Route exact path='/profile' render={(props) => (<ShowProfile {...props} userInfo={this.props.userData.userInfo} />)} />
            <Route path='/profile/edit' render={(props) => (<Edit {...props} props={this.props} />)} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Profile;