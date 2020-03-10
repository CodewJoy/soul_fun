/* eslint-disable no-undef */
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import './home.css';
import Navbar from '../Header';
import DiscoverFriend from './discover_friend';
import FriendRequests from './friend_request';
import MyFriend from './my_friend';
import { Badge } from '@material-ui/core';
import Discover from '../img/discover.svg';
import Invitation from '../img/invitation.svg';
import Myfriend from '../img/my_friend.svg';


const Home = () => (
  <>
    <AuthUserContext.Consumer>
      {userData => (
        <FirebaseContext.Consumer>
          {(firebase) => <HomeBase
            userData={userData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'discover',
    }
    this.sideNav = this.sideNav.bind(this);
  }
  sideNav(name) {
    this.setState({ selected: name });
  }
  render() {
    return (
      <div className="home">
        <Navbar />
        <div className="main">
          <ul className="sideNav">
            <Link to='/home' className={this.state.selected === 'discover' ? "active" : "none"} onClick={() => this.sideNav('discover')}>
              <li className="center">
                <img src={Discover} alt="discover" className="home-icon" />
                <p className="home-sidenav">&emsp;Discover Friends</p>
              </li>
            </Link>
            <Link to='/home/friend-requests' className={this.state.selected === 'requests' ? "active" : "none"} onClick={() => this.sideNav('requests')}>
              <li className="center">
                <Badge badgeContent={this.props.userData.friendInvitation} color="primary">
                  <img src={Invitation} alt="invitation" className="home-icon" />
                </Badge>
                <p className="home-sidenav">&emsp;Friend Requests</p>
              </li>
            </Link>
            <Link to='/home/my-friend' className={this.state.selected === 'myfriend' ? "active" : "none"} onClick={() => this.sideNav('myfriend')}>
              <li className="center">
                <img src={Myfriend} alt="myfriend" className="home-icon" />
                <p className="home-sidenav">&emsp;My Friend</p>
              </li>
            </Link>
          </ul>
          <Switch>
            <Route exact path='/home' render={(props) => (<DiscoverFriend {...props} props={this.props} />)} />
            <Route path='/home/friend-requests' render={(props) => (<FriendRequests {...props} props={this.props} />)} />
            <Route path='/home/my-friend' render={(props) => (<MyFriend {...props} props={this.props} />)} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default Home;