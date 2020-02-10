/* eslint-disable no-undef */
import React, { Component } from 'react';
import Navigation from '../App/navigation.js';
import './home.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';
import Loading from '../img/loading.gif';

const Home = () => (
  <>
    <AuthUserContext.Consumer>
      {UserData => (
        <FirebaseContext.Consumer>
          {(firebase) => <HomeBase 
            UserData={UserData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      friendlist:[]
    }
    this.addFriend = this.addFriend.bind(this)
  }
  componentDidMount() {
    console.log(this.props);
    this.props.firebase.db.collection("Users")
    .get()
    // .then(res => res.json())
    .then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          this.setState((state) => {
            let friendlist = state.friendlist.concat(doc.data());
            return { friendlist };
          }
          // , () => {
          //   console.log(this.state);
          // }
          );
        });
        this.setState({
          isLoaded: true,
        })
        console.log(this.state)
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      }
  )}

  addFriend(id, name, avatar) {
    const { firebase, UserData } = this.props
    console.log(UserData);
    // console.log(this.props.authUser.authUser.uid);
    // console.log(id);
    // console.log(this.props.authUser.authInfo.name);
    // console.log(this.props.authUser.authInfo.avatar);

    // modify my list
    firebase.db.collection("Users").doc(UserData.authUser.uid).collection("friends").doc(id)
    .set(
      {
        id: id,
        name: name,
        avatar: avatar,
        status: "waitHisConfirm"
      }
    );
    // modify invited friend's list
    firebase.db.collection("Users").doc(id).collection("friends").doc(UserData.authUser.uid)
    .set(
      {
        id: UserData.authUser.uid,
        name: UserData.userInfo.username,
        avatar: UserData.userInfo.avatar,
        status: "askUrConfirm"
      }
    )
    // 顯示已加對方好友功能
  }

  render() {
    const { error, isLoaded, friendlist } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
      
    } else {
      return (
        <div className="home">
          <div className="navbar">
            <div className="logo">
              <img className="logo-img" src={Logo} alt="Logo" />
              <h3>SOULFUN</h3>
            </div>
            <Navigation />
          </div>
          <Main friendlist = {friendlist} addFriend= {this.addFriend.bind(this)}/>
        </div>
      )
    }
  }
}
class Main extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    // this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(id, name, avatar) {
    // console.log(id, name, avatar);
    this.props.addFriend(id, name, avatar);
  }
  render() {
    return (
      <div className="main">
        <div className="container">
          {this.props.friendlist.map(item => (
            <div key={item.id} className="friend-box">
              <img className="avatar" src={item.avatar} alt="avatar" />
              <h3>{item.username}</h3>
              <p>Country: {item.country}</p>
              <hr/>
              <p>Language: {item.language}</p>
              <h4>Interest: {item.interest}</h4>
              <button key={item.id} onClick={this.handleSubmit.bind(this,item.id,item.username,item.avatar)}>Add Friend</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home;