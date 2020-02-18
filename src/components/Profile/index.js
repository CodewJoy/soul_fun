/* eslint-disable react/prop-types */
import React, { Component } from 'react';
// import Select from 'react-select'
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import './profile.css';
import Logo from '../img/logo.svg';
import Navigation from '../App/navigation.js';
import Loading from '../img/loading.gif';

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
    // this.friendInvite = this.friendInvite.bind(this);
    // this.confirmFriendFriend = this.confirmFriendFriend.bind(this);
  }
  // componentDidMount() {
  //   const { UserData, firebase } = this.props;
  //   if (UserData.authUser) {
  //     console.log("Updated", this.state.isLoaded_friend);
  //     if (!this.state.isLoaded_friend) {
  //       this.friendInvite(UserData.authUser.uid, firebase, UserData);
  //       this.setState({ isLoaded_friend: true });
  //     }
  //   }
  // }
  // componentDidUpdate() {
  //   const { UserData, firebase } = this.props;
  //   console.log("Updated", this.state.isLoaded_friend);
  //   if (!this.state.isLoaded_friend) {
  //     this.friendInvite(UserData.authUser.uid, firebase, UserData);
  //     this.setState({ isLoaded_friend: true });
  //   }
  // }
  // friendInvite(myuid, firebase) {
  //   firebase.db.collection("Users").doc(myuid).collection("friends")
  //     // .get()
  //     // .then(
  //     // use .onSnapshot() instead of .get() to get notice immediately
  //     .onSnapshot(
  //       (querySnapshot) => {
  //         let confirmfriend = [];
  //         querySnapshot.forEach((doc) => {
  //           // doc.data() is never undefined for query doc snapshots
  //             if (doc.data().status === "askUrConfirm") {
  //               console.log(doc.id, " => ", doc.data());
  //               confirmfriend.push(doc.data());
  //             }
  //           })
  //           this.setState({ confirmfriend });
  //       },
  //       (error) => {
  //         console.log(error)
  //       }
  //     )
  //   // )
  // }
  // confirmFriend(id) {
  //   const { firebase, UserData } = this.props
  //   console.log(UserData);
  //   // modify my list
  //   firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends").doc(id)
  //     .update(
  //       {
  //         status: "confirm"
  //       }
  //     );
  //   // modify invited friend's list
  //   firebase.db.collection("Users").doc(id).collection("friends").doc(UserData.authUser.uid)
  //     .update(
  //       {
  //         status: "confirm"
  //       }
  //     )
  //   // 建立聊天室
  //   firebase.db.collection("Room").doc(UserData.authUser.uid).collection("friends").doc(UserData.authUser.uid)
  //     .update(
  //       {
  //         status: "confirm"
  //       }
  //     )
  // }
  render() {
    // const { confirmfriend } = this.state
    // const { isLoaded_friend, confirmfriend } = this.state
    // if (!isLoaded_friend) {
    //   return <div className="loading"><img src={Loading} alt="Loading" /></div>
    // } else {
      console.log(this.props)
      return (
        <div className="profile">
          <Navbar />
          <div className="main">
            <Display userInfo={this.props.UserData.userInfo} />
            <Setting userInfo={this.props.UserData.userInfo} />
            {/* <ConfirmFriend />
            <ConfirmFriend confirmfriend={confirmfriend}
              confirmFriend={this.confirmFriend.bind(this)}
            /> */}
          </div>
          <div className="center-button">
            <button>Change your profile</button>
          </div>
        </div>
      );
  }
}
class ConfirmFriend extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit(id) {
    console.log(id);
    this.props.confirmFriend(id);
  }
  render() {
    console.log(this.props)
    const { confirmfriend } = this.props
    return (
      <div className="confirm-friend">
        <h3>Friend Invitation</h3>
        {confirmfriend.map(item => (
          <div className="confirm-box" key={item.id}>
            <img className="avatar" src={item.avatar} alt="avatar" />
            <div className="center">
              <h4>{item.name}</h4>
              <button onClick={this.handleSubmit.bind(this, item.id)}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    )
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