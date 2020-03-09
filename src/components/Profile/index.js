/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Select from 'react-select'
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
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
    console.log(props);
    this.state = {
      selected: 'show-profile'
    }
    this.sideNav = this.sideNav.bind(this);
  }
  sideNav(name) {
    this.setState({ selected: name });
  }
  render() {
    // console.log(this.props);
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

class Edit extends Component {
  render() {
    console.log('edit', this.props);
    return (
      <div className="view">
        Edit
      </div>
    )
  }
}

class ShowProfile extends Component {
  render() {
    console.log(this.props);
    const { gender, birthday, country, location, language, interest, bio } = this.props.userInfo;
    return (
      <div className="view">
        <div className="display">
          <img className="avatar" src={this.props.userInfo.avatar} alt="avatar" />
          <h3>Hey {this.props.userInfo.username}!</h3>
        </div>
        <div className="setting">
          <h3>My profile</h3>
          <p className="gender">
            <b>Gender&ensp;</b>{gender}
          </p>
          <p className="birthday">
            <b>Birthday&ensp;</b>{birthday}
          </p>
          <p className="age">
            <b>Age&ensp;</b>
          </p>
          <p className="star-sign">
            <b>Star-Sign&ensp;</b>
          </p>
          <p className="language">
            <b>Language&ensp;</b>{language}
          </p>
          <p className="country">
            <b>Country&ensp;</b>{country}
          </p>
          <p className="location">
            <b>Location&ensp;</b>{location}
          </p>
          <p className="bio">
            <b>Intro&ensp;</b>{bio}
          </p>
          <div className="interest">
            <b>Interest&ensp;</b>
            <br/>
            <div className='interest-tag-wrapper'>
              {interest.map(int => (<b className='interest-tag' key={int}>{int}</b>))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile;