import React, { Component } from 'react';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import './message.css';
import Logo from '../img/logo.svg';
import Navigation from '../App/navigation.js';
import Loading from '../img/loading.gif';

const Message = () => {
  return (
    <>
      <AuthUserContext.Consumer>
        {(UserData) => (
          <FirebaseContext.Consumer>
            {(firebase) => <MessageBase UserData={UserData} firebase={firebase} />}
          </FirebaseContext.Consumer>
        )}
      </AuthUserContext.Consumer>
    </>
  );
}

class MessageBase extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      isLoaded: false,
      // friend: [],
      document: [],
      chat: [],
      // room: []
    }
    this.loadProfileName = this.loadProfileName.bind(this);
  }
  componentDidMount() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    // load room list
    if (UserData.authUser) {
      if (!isLoaded) {
        this.loadProfileName(firebase, UserData, isLoaded);
        this.setState({ isLoaded: true });
      }
    }
  }
  componentDidUpdate() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    // load room list
    if (!isLoaded) {
      this.loadProfileName(firebase, UserData);
      this.setState({ isLoaded: true });
    }
  }
  loadProfileName(firebase, UserData) {
    let document = [];
    // firebase.db.collection("Room").doc().collection("message").doc()
    firebase.db.collection("Room").where("uid", "array-contains", `${UserData.authUser.uid}`)
      .onSnapshot(
        (querySnapshot) => {
          // console.log(doc.id, " => ", doc.data());
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.data().user1.uid !== UserData.authUser.uid) {
              document.push([doc.id, doc.data().timestamp, doc.data().user1]);
            } else if (doc.data().user2.uid !== UserData.authUser.uid) {
              document.push([doc.id, doc.data().timestamp, doc.data().user2]);
            }
          })
          this.setState({ document });
          console.log('document', document);
          console.log('document', document[0]);
          console.log('document', document[0][0]);
          // load message
          // firebase.db.collection("Room").doc(this.state.document[0][0]).collection("message").orderBy("timestamp")
          //   .onSnapshot(
          //     (querySnapshot) => {
          //       let chat = [];
          //       querySnapshot.forEach((doc) => {
          //         console.log(doc.id, " => ", doc.data());
          //         chat.push(doc.data());
          //       })
          //       this.setState({ chat });
          //     },
          //     (error) => {
          //       console.log(error)
          //     }
          //   )
        },
        (error) => {
          console.log(error)
        },
      )
  }
  render() {
    // const { isLoaded_friend, confirmfriend } = this.state
    if (!this.state.isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      console.log("chat", this.state)
      console.log("chat", this.props)
      // console.log('friendID', this.props.UserData.friendID)
      return (
        <div className="message">
          <Navbar />
          <div className="main">
            <div className='chat-room'>
              {this.state.document.map(item => (
                <div className="chat-box" key={item[2].uid}>
                  <img className="avatar" src={item[2].avatar} alt="avatar" />
                  <div className="container">
                    <h4 className="name">{item[2].name}</h4>
                    <p className="word">word</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="headerDivider"></div>
            <div className='conversation'>
              <div className="talks">
                <h1>talk content</h1>
              </div>
              <div className="input-box">
                <input className='input-message' type="text" />
                <button className='input-click'>Enter</button>
              </div>

            </div>
            {/* <div className="headerDivider"></div>  */}
            {/* <ChatRoom friend={this.state.friend} /> */}
            {/* <Conversation /> */}
            {/* <friendProfile friendList={this.state.friendList}/> */}
          </div>
        </div>
      );
    }
  }
}

// class ChatRoom extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     // console.log('chat', this.props.friend);
//     // const { friend } = ;
//     return (
//       <div className='chat-room'>
//         {/* {this.props.friend.map(item => (
//           <div className="chat-box" key={item.toString()+Date.now()}>
//             <h3>{item}</h3>
//           </div>
//         ))} */}
//       </div>
//     )
//   }
// }

class Conversation extends Component {
  render() {
    return (
      <div className='conversation'>
        <h1>TalkContent</h1>
      </div>
    )
  }
}

// class friendProfile extends Component {
//   render() {
//     console.log(this.props)
//     const { friendList } = this.props
//     return (
//       <div className='pick-friend'>
//         <p>Talk to your friend</p>
//         <div className='pick-box'>
//           {/* <img className="avatar" src='https://firebasestorage.googleapis.com/v0/b/personal-project-b5b0e.appspot.com/o/002-male.svg?alt=media&token=e78987fe-00b1-4848-aee7-dc621352875d' alt="avatar" /> */}
//           <h4>name</h4>
//         </div>
//       </div>
//     )
//   }
// }

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


export default Message;