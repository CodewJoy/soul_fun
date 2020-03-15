import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { createRoomID, getDistanceSpecifiedTime, getAge } from "./utils";
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import Loading from '../img/loading.gif';

class FriendRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            confirmfriend: [],
            goToChat: false,
            showCard: false,
            clickWhom: '',
        }
        this.friendInvite = this.friendInvite.bind(this);
        this.confirmFriend = this.confirmFriend.bind(this);
        this.closeCard = this.closeCard.bind(this);
    }
    componentDidMount() {
        const { userData } = this.props.props;
        if (userData.authUser) {
            this.friendInvite();
        }
    }
    componentDidUpdate() {
        if (!this.state.isLoaded) {
            this.friendInvite();
            this.setState({ isLoaded: true });
        }
    }
    componentWillUnmount() {
        this.unsubscribes();
    }
    friendInvite() {
        const { firebase, userData } = this.props.props;
        this.unsubscribes = firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends")
            // .get()
            // .then(
            // use .onSnapshot() instead of .get() to get notice immediately
            .onSnapshot(
                (querySnapshot) => {
                    let confirmfriend = [];
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        if (doc.data().status === "askUrConfirm") {
                            // console.log(doc.id, " => ", doc.data());
                            confirmfriend.push(doc.data());
                        }
                    })
                    this.setState({ confirmfriend });
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    confirmFriend(id, name, avatar) {
        const { firebase, userData } = this.props.props;
        // console.log(userData);
        // modify my list
        firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends").doc(id)
            .update(
                {
                    status: "confirm"
                }
            );
        // modify invited friend's list
        firebase.db.collection("Users").doc(id).collection("friends").doc(userData.authUser.uid)
            .update(
                {
                    status: "confirm"
                }
            )
        // 建立聊天室
        // createRoomID(uid1, uid2)
        let roomID = createRoomID(id, userData.authUser.uid);
        console.log(roomID);
        let timestamp = Date.now();
        // 同時設定文件欄位又設定他的子集合兩件事並不衝突
        if (roomID) {
            firebase.db.collection("Room").doc(roomID)
                .set(
                    {
                        uid: [userData.authUser.uid, id],
                        user1: { uid: userData.authUser.uid, avatar: userData.userInfo.avatar, name: userData.userInfo.username },
                        user2: { uid: id, avatar: avatar, name: name },
                        timestamp: timestamp
                    }
                )
                .then(
                    // 這段是要設給已經收到邀請後 confirm to chat 的頁面
                    firebase.db.collection("Room").doc(roomID).collection("message").doc()
                        .set(
                            {
                                sender: "admin",
                                content: "You both are friends now. Let's message your friend.",
                                timestamp: timestamp
                            }
                        )
                        .then(
                            this.setState({ goToChat: true })
                        )
                )
            // update context
            // this.setState({ goToChat: true, friendID: id });
            // () => {this.setState({ goToChat: true })};
        }
    }
    showCard(id) {
        // console.log('personinfo', id);
        this.props.props.firebase.db.collection("Users").doc(id)
            .get()
            .then(
                (doc) => {
                    // console.log("Document data:", doc.data());
                    this.setState({ clickWhom: doc.data(), showCard: !this.state.showCard });
                }
            )
            .catch(function (error) {
                console.log("Error getting document:", error);
            });
    }
    closeCard() {
        this.setState({ showCard: !this.state.showCard })
    }
    render() {
        // console.log('confirmfriend', this.state.confirmfriend);
        // console.log('clickWhom', this.state.clickWhom);
        // console.log('confirmfriend', this.props);
        const { confirmfriend, showCard, clickWhom } = this.state;

        if (this.state.goToChat) {
            return <Redirect to="/message" />
        }
        if (!this.state.isLoaded) {
            return <div className="loading"><img src={Loading} alt="Loading" /></div>
        } else {
            return (
                <div className="view">
                    <h3>Your Friend Requests</h3>
                    <div className="container">
                        {confirmfriend.map(item => (
                            <div className="friend-box" key={item.id}>
                                <img className="avatar" src={item.avatar} alt="avatar" />
                                <div className="friend-box-text">
                                    <h4>{item.name}</h4>
                                    <button className="see-more" onClick={this.showCard.bind(this, item.id)}>See more</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {showCard ? (
                        <div className="show-card">
                            <div className="show-card-center">
                                <img className="avatar" src={clickWhom.avatar} alt="avatar" />
                                <p>
                                    <b>{clickWhom.username}</b>
                                </p>
                            </div>
                            <p>
                                <b>Intro</b>
                            </p>
                            <p>{clickWhom.bio}</p>
                            <div className="container">
                                <div className="container-1">
                                    <p>
                                        <b>Gender&ensp;</b>
                                        {clickWhom.gender}
                                    </p>
                                    <p>
                                        <b>Age&ensp;</b>
                                        {getAge(clickWhom.birthday)}
                                    </p>
                                    <p>
                                        <b>Last online&ensp;</b>
                                        {getDistanceSpecifiedTime(clickWhom.timestamp)}
                                    </p>
                                </div>
                                {/* <div className="line"></div> */}
                                <div className="container-2">
                                    <p>
                                        <b>Language&ensp;</b>
                                        {clickWhom.language}
                                        {/* {clickWhom.language.map(int => (<span key={int}>{int}&ensp;</span>))} */}
                                    </p>
                                    <p>
                                        <b>Country&ensp;</b>
                                        {clickWhom.country}
                                    </p>
                                    <p>
                                        <b>Location&ensp;</b>
                                        {clickWhom.location}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <b>Interest&ensp;</b>
                                <div className='interest-tag-wrapper'>
                                    {clickWhom.interest.map(int => (<b className='interest-tag-home' key={int}>{int}</b>))}
                                </div>
                            </div>
                            <div className="container-button">
                                <div className="go-back" onClick={this.closeCard}>
                                    <ArrowBackSharpIcon style={{ fontSize: 40 }} />
                                    Go Back
                      </div>
                                <button onClick={this.confirmFriend.bind(this, clickWhom.id, clickWhom.username, clickWhom.avatar)}>Confirm</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )

        }
    }
}

export default FriendRequests;