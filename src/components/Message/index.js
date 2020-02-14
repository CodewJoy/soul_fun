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
      isLoaded_update: false,
      // friend: [],
      document: [],
      // chat: [],
      // room: []
      value: '',
      message: []
      
    }
    this.loadRoom = this.loadRoom.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    // load room list
    if (UserData.authUser) {
      if (!isLoaded) {
        this.loadRoom(firebase, UserData, isLoaded);
        this.loadMessage(firebase, UserData);
        this.setState({ isLoaded: true });
      }
    }
  }
  componentDidUpdate() {
    const { firebase, UserData } = this.props;
    const { isLoaded } = this.state;
    // load room list
    if (!isLoaded) {
      this.loadRoom(firebase, UserData);
      this.loadMessage(firebase, UserData);
      this.setState({ isLoaded: true });
    }
  }
  loadRoom(firebase, UserData) {
    //let document = [];
    // firebase.db.collection("Room").doc().collection("message").doc()
    firebase.db.collection("Room").where("uid", "array-contains", `${UserData.authUser.uid}`)
      .onSnapshot(
        (querySnapshot) => {
          let document = [];
          // console.log(doc.id, " => ", doc.data());
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.data().user1.uid !== UserData.authUser.uid) {
              document.push([doc.id, doc.data().timestamp, doc.data().user1]);
            } else if (doc.data().user2.uid !== UserData.authUser.uid) {
              document.push([doc.id, doc.data().timestamp, doc.data().user2]);
            }
          })
          //this.setState({ document });
          console.log('document', document);
          // console.log('document', document[0]);
          // console.log('document', document[0][0]);
          // load message
          let loaded = 0;
          for (let i = 0; i < document.length; i++ ) {
            // 每個 message 都取最近的值
            firebase.db.collection("Room").doc(document[i][0]).collection("message").orderBy("timestamp")
            .onSnapshot(
              (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  console.log(doc.id, " => ", doc.data());
                  document[i][2].chat = (doc.data());
                })
                loaded++;
                console.log("loaded", loaded);
                if (loaded === document.length) {
                  console.log("document_peng", document);
                  this.setState({ document });
                }
              },
              (error) => {
                console.log(error)
              }
            )
          }
        },
        (error) => {
          console.log(error)
        }
      )
  }
  loadMessage(firebase, UserData) {
    // 需要兩個人的 uid 找到檔案名 再往下找 message snapShot
    // 可以先抓最近的 user?
    // this.state.document 抓到是空值
    console.log('dialogue', this.state.document);
    // let roomID = createRoomID(UserData.authUser.uid, this.state.document[0][2].uid) 
    // firebase.db.collection("Room").doc(roomID).collection("message").orderBy("timestamp")
    //   .onSnapshot(
    //     (querySnapshot) => {
    //       let chat = [];
    //       querySnapshot.forEach((doc) => {
    //         console.log(doc.id, " => ", doc.data());
    //         document[i][2].chat = (doc.data());
    //       })
    //       this.setState({ chat });
    //     },
    //     (error) => {
    //       console.log(error)
    //     }
    //   )
  }
  handleChange(event) {
    // this.setState({value: event.target.value});
    (() => this.setState({value: event.target.value}))(console.log(this.state.value));
  }
  handleSubmit(event) {
    // console.log(this.state.value);
    event.preventDefault();
    const { firebase, UserData } = this.props;
    // 要有資料防護機制 在還沒 load 完之前不能按？
    // 需要兩個人的 uid 找到檔案名 再往下找 message 輸入
    // 可以先抓最近的 user
    console.log('input',this.state.document[0][2].uid);
    let roomID = createRoomID(UserData.authUser.uid, this.state.document[0][2].uid) 
    firebase.db.collection("Room").doc(roomID).collection("message").doc()
      .set(
        {
          sender: UserData.userInfo.username,
          content: this.state.value,
          timestamp: Date.now()
        }
      )

  }
  render() {
    console.log("render", this.state.document);
    if (!this.state.isLoaded) {
      return <div className="loading"><img src={Loading} alt="Loading" /></div>
    } else {
      console.log("chat", this.state)
      console.log("chat", this.props)
      // console.log('friendID', this.props.UserData.friendID)
      // console.log("render", this.state.document[0][2].chat)
      // state 更新後 document 有值再進來
      if(this.state.document.length > 0) {
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
                      <p className="word">{item[2].chat.content ? item[2].chat.content : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="headerDivider"></div>
              <div className='conversation'>
                <div className="talks">
                  <h1>talk content</h1>
                  {/* 放入 loadMessage 的資料*/}
                  <p>動態 div</p>
                </div>
                <div className="input-box">
                  <form onSubmit={this.handleSubmit}>
                    <input className='input-message' type="text" value={this.state.value} onChange={this.handleChange} />
                    <input className='input-click' type="submit" value="Enter" />
                  </form>
                </div>
              </div>
              {/* <div className="headerDivider"></div>  */}
              {/* <ChatRoom friend={this.state.friend} /> */}
              {/* <Conversation /> */}
              {/* <friendProfile friendList={this.state.friendList}/> */}
            </div>
          </div>
        );
      } else {
        return <div className="loading"><img src={Loading} alt="Loading" /></div>
      }
    }
  }
}
function createRoomID(uid1, uid2) {
  if (uid1 < uid2) {
    return uid1+uid2;  
    }
  else {
    return uid2+uid1;
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

// class Conversation extends Component {
//   render() {
//     return (
//       <div className='conversation'>
//         <h1>TalkContent</h1>
//       </div>
//     )
//   }
// }

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