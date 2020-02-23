/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import Select from 'react-select'
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import './profile.css';
import Logo from '../img/logo.svg';
import Navigation from '../App/navigation.js';
import Loading from '../img/loading.gif';
import SignOutButton from '../LogOut';

const Profile = () => (
  <>
    <AuthUserContext.Consumer>
      {(UserData) => (
        <FirebaseContext.Consumer>
          {(firebase) => <ProfileBase UserData={UserData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

// const options = [
//   { value: 'english', label: 'English' },
//   { value: 'franch', label: 'Franch' },
//   { value: 'chinese', label: 'Chinese' }
// ]

class ProfileBase extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      // isLoaded: false,
      isLoaded_friend: false,
      confirmfriend: []
    }
  }
  
  render() {
    // const { confirmfriend } = this.state
    // const { isLoaded_friend, confirmfriend } = this.state
    // if (!isLoaded_friend) {
    //   return <div className="loading"><img src={Loading} alt="Loading" /></div>
    // } else {
    console.log(this.props);
    return (
      <div className="profile">
        <Navbar />
        <div className="main">
          <SignOutButton />
          {/* <ul className="sideNav">
            <li className={this.state.selected === 'discover' ? "active" : "none"} onClick={() => this.sideNav('discover')}>
              <Link to='/home'>Discover Friends</Link>
            </li>
            <li className={this.state.selected === 'requests' ? "active" : "none"} onClick={() => this.sideNav('requests')}>
              <Link to='/home/friend-requests'>Friend Requests</Link>
            </li>
          </ul>
          <Switch>
            <Route exact path='/home' render={(props) => (<DiscoverFriend {...props} referlist={referlist} addFriend={this.addFriend.bind(this)} />)} />
            <Route path='/home/friend-requests' render={(props) => (<FriendRequests {...props} props={this.props} />)} />
            <Route path='/home/my-friend' render={(props) => (<MyFriend {...props} props={this.props} />)} />
          </Switch> */}
          <Display userInfo={this.props.UserData.userInfo} />
          <Setting userInfo={this.props.UserData.userInfo} />
          {/* <ConfirmFriend />
            <ConfirmFriend confirmfriend={confirmfriend}
              confirmFriend={this.confirmFriend.bind(this)}
            /> */}
        </div>
        <div className="center-button">
          <button>Edit</button>
        </div>
      </div>
    );
  }
}

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="logo">
          <img className="logo-img" src={Logo} alt="Logo" />
          <h3>SOULFUN</h3>
        </div>
        <Navigation />
      </div>
    )
  }
}

class Display extends Component {
  constructor(props) {
    super(props);
    // this.onChange = this.onChange.bind(this);
  }
  // onChange(event) {
  //   this.props.changeProfile({ [event.target.name]: event.target.value });
  // }
  render() {
    return (
      <div className="display">
        {/* <img className="avatar" src={AvatarImage} alt="avatar" /> */}
        <img className="avatar" src={this.props.userInfo.avatar} alt="avatar" />
        <h4>Hey {this.props.userInfo.username}!</h4>
        <p className="age">age</p>
        <p className="star-sign">star-sign</p>
      </div>
    )
  }
}

class Setting extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // console.log(this.props.userInfo.interest)
    const { gender, birthday, country, location, language, interest, bio } = this.props.userInfo;
    return (
      <div className="setting">
        <h3>My profile</h3>
        <p className="gender">
          Gender: {gender}
        </p>
        <p className="birthday">
          Birthday: {birthday}
        </p>
        <p className="country">
          Country: {country}
        </p>
        <p className="location">
          Location: {location}
        </p>
        <p className="language">
          Language: {language}
        </p>
        <p className="interest">
          Interest: {interest}
          {/* {this.props.userInfo.interest.map(item => (
            // <div key={item.index} >
              <p>{item.value}</p>
            // </div>
          ))} */}
        </p>
        <p className="bio">
          Intro: {bio}
        </p>
      </div>
    )
  }
}

export default Profile;