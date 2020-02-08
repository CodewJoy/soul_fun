/* eslint-disable no-undef */
import React, { Component } from 'react';
import Navigation from '../App/navigation.js';
import './home.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';

const Home = () => (
  <>
    <AuthUserContext.Consumer>
      {authUser => (
        <FirebaseContext.Consumer>
          {(firebase) => <HomeBase authUser={authUser} firebase={firebase} />}
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
    console.log(this.props.authUser);
    // console.log(this.props.authUser.authUser.uid);
    // console.log(id);
    // console.log(this.props.authUser.authInfo.name);
    // console.log(this.props.authUser.authInfo.avatar);

    // modify my list
    this.props.firebase.db.collection("Users").doc(this.props.authUser.authUser.uid).collection("friends").doc(id)
    .set(
      {
        id: id,
        name: name,
        avatar: avatar,
        status: "waitHisConfirm"
      }
    );
    // modify my friend's list
    // this.props.firebase.db.collection("Users").doc(id).collection("friends").doc(this.props.authUser.authUser.uid)
    // .set(
    //   {
    //     id: this.props.authUser.authUser.uid,
    //     name: "this.props.authUser.authInfo.name",
    //     avatar: this.props.authUser.authInfo.avatar,
    //     status: "askUrConfirm"
    //   }
    // )
  }

  render() {
    const { error, isLoaded, friendlist } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
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
        {this.props.friendlist.map(item => (
            <div key={item.id} className="friend-box">
              <p>{item.avatar}</p>
              <p>Name: {item.username}</p>
              <p>Country: {item.country}</p>
              <hr/>
              <p>Language: {item.language}</p>
              <p>Interest: {item.interest}</p>
              <button key={item.id} onClick={this.handleSubmit.bind(this,item.id,item.username,item.avatar)}>Add Friend</button>
            </div>
        ))}
      </div>
    )
  }
}
// class Friend extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <>
//       </>
//     )
//   }
// }

export default Home;