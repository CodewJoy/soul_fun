import React, { Component } from 'react';
import { deleteIntersection } from "./utils";
import { INTERESTS } from '../../constants/factor.js';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loading from '../img/loading.gif';

class DiscoverFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goToHome: false,
            error: null,
            isLoaded: false,
            isLoaded_friend: false,
            // friendlist: [],
            referlist: [],
            showCard: false,
            clickWhom: '',
            // interest: ''
        }
        this.addFriend = this.addFriend.bind(this);
        this.referFriends = this.referFriends.bind(this);
        this.closeCard = this.closeCard.bind(this);
        this.getInterest = this.getInterest.bind(this);
        this.filterFriend = this.filterFriend.bind(this);
    }
    // 拿 user id 取值，換 router 於此才會拿到更新 context 中的 user id
    componentDidMount() {
        const { userData, firebase } = this.props.props;
        const { isLoaded } = this.state;
        if (userData.authUser) {
            if (!isLoaded) {
                this.referFriends('', userData, firebase);
            }
        }
    }
    // 拿 user id 取值，重整畫面於此才會拿到更新 context 中的 user id
    componentDidUpdate() {
        const { userData, firebase } = this.props.props;
        const { isLoaded } = this.state;
        // 加個鎖不然會無限 loading
        if (!isLoaded) {
            this.referFriends('', userData, firebase);
        }
    }
    componentWillUnmount() {
        this.unsubscribe1();
        for (let i = 0; i < this.unsubscribe2.length; i++) {
            this.unsubscribe2[i]
        }
    }
    referFriends(interest, userData, firebase) {
        // 取得目前用戶列表
        if (interest === '') {
            firebase.db.collection("Users")
                .orderBy("timestamp", "desc")
                .limit(20)
                .get()
                .then(
                    (querySnapshot) => {
                        let friendlist = [];
                        querySnapshot.forEach((doc) => {
                            // if 有填資料再進來
                            if (doc.data().avatar) {
                                // cant see self as a friend
                                if (doc.id !== userData.authUser.uid) {
                                    // console.log(doc.id, " => ", doc.data());
                                    friendlist.push(doc.data().id);
                                }
                            }
                        });
                        this.filterFriend(firebase, userData.authUser.uid, friendlist)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        } else {
            firebase.db.collection("Users").where('interest', "array-contains", interest)
                // .orderBy("timestamp","desc")
                .limit(20)
                .get()
                .then(
                    (querySnapshot) => {
                        let friendlist = [];
                        querySnapshot.forEach((doc) => {
                            // if 有填資料再進來
                            if (doc.data().avatar) {
                                // cant see self as a friend
                                if (doc.id !== userData.authUser.uid) {
                                    // console.log(doc.id, " => ", doc.data());
                                    friendlist.push(doc.data().id);
                                }
                            }
                        });
                        this.filterFriend(firebase, userData.authUser.uid, friendlist)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
    }
    filterFriend(firebase, id, friendlist) {
        // 先取得我的朋友列表
        this.unsubscribe1 = firebase.db.collection("Users").doc(id).collection("friends")
            .onSnapshot(
                (querySnapshot) => {
                    let myfriend = [];
                    querySnapshot.forEach((doc) => {
                        // console.log('myfriend', doc.id, " => ", doc.data());
                        myfriend.push(doc.data().id);
                    })
                    // console.log('myfriend', myfriend);
                    // console.log('friendlist', friendlist);
                    console.log(deleteIntersection(friendlist, myfriend));
                    let loaded = 0;
                    let refer = deleteIntersection(friendlist, myfriend);
                    let referlist = [];
                    this.unsubscribe2 = [];
                    for (let i = 0; i < refer.length; i++) {
                        this.unsubscribe2[i] = firebase.db.collection("Users").doc(refer[i])
                            .onSnapshot(
                                (doc) => {
                                    // console.log("Document data:", doc.data());
                                    referlist.push(doc.data());
                                    loaded++;
                                    if (loaded === refer.length) {
                                        // console.log("document_try", document);
                                        this.setState({
                                            referlist: referlist,
                                            isLoaded: true
                                        });
                                    }
                                },
                                (error) => {
                                    console.log(error);
                                    this.setState({
                                        isLoaded: true,
                                        error
                                    })
                                }
                            )
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
    }
    addFriend(id, name, avatar) {
        const { firebase, userData } = this.props.props;
        // console.log(userData);
        // modify my list
        firebase.db.collection("Users").doc(userData.authUser.uid).collection("friends").doc(id)
            .set(
                {
                    id: id,
                    name: name,
                    avatar: avatar,
                    status: "waitHisConfirm"
                }
            );
        // modify invited friend's list
        firebase.db.collection("Users").doc(id).collection("friends").doc(userData.authUser.uid)
            .set(
                {
                    id: userData.authUser.uid,
                    name: userData.userInfo.username,
                    avatar: userData.userInfo.avatar,
                    status: "askUrConfirm"
                }
            )
    }
    handleSubmit(id, name, avatar) {
        // console.log(id, name, avatar);
        this.addFriend(id, name, avatar);
        this.setState({ showCard: !this.state.showCard })
    }
    showCard(item) {
        // console.log('personinfo', item);
        this.setState({ clickWhom: item, showCard: !this.state.showCard });
    }
    closeCard() {
        this.setState({ showCard: !this.state.showCard })
    }
    getInterest(e) {
        const { userData, firebase } = this.props.props;
        this.referFriends(e.target.textContent, userData, firebase);
        // this.setState({ interest: e.target.textContent }, () => {
        //   console.log(this.state)
        // });
    }
    render() {
        // console.log('discover', this.props);
        // console.log('discover', this.state);
        const { showCard, clickWhom, isLoaded, referlist } = this.state;
        if (!isLoaded) {
            return <div className="loading"><img src={Loading} alt="Loading" /></div>
        } else {
            return (
                <div className="view">
                    <h3>Discover new friends here!</h3>
                    <Autocomplete
                        value={this.state.interest}
                        // name="location"
                        onChange={this.getInterest}
                        options={INTERESTS}
                        id="select-by-interest"
                        autoComplete
                        includeInputInList
                        renderInput={params => <TextField {...params} label="Select by Interest" margin="normal" />}
                    />
                    <div className="container">
                        {referlist.map(item => (
                            <div key={item.id} className="friend-box">
                                <img className="avatar" src={item.avatar} alt="avatar" />
                                <div className="friend-box-text">
                                    <p>
                                        <b>{item.username}</b>
                                    </p>
                                    <p>{item.country},&nbsp;{item.language}</p>
                                    <hr />
                                    <div className="interest-box">
                                        <p className="interest-ellipsis">
                                            {/* <b>{item.interest}</b> */}
                                            {item.interest.map(int => (<b key={int}>{int}&ensp;</b>))}
                                        </p>
                                    </div>
                                    <button className="see-more" onClick={this.showCard.bind(this, item)}>See more</button>
                                </div>
                                {/* <div className="bottom-line"></div> */}
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
                                    </p>
                                    <p>
                                        <b>Star-Sign&ensp;</b>
                                    </p>
                                </div>
                                {/* <div className="line"></div> */}
                                <div className="container-2">
                                    <p>
                                        <b>Language&ensp;</b>
                                        {/* {clickWhom.language.map(int => (<b key={int}>{int}&ensp;</b>))} */}
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
                            <p>
                                <b>Last online&ensp;</b>
                            </p>
                            <div>
                                <b>Interest&ensp;</b>
                                <div className='interest-tag-wrapper'>
                                    {clickWhom.interest.map(int => (<b key={int} className='interest-tag-home'>{int}</b>))}
                                </div>
                            </div>
                            <div className="container-button">
                                <div className="go-back" onClick={this.closeCard}>
                                    <ArrowBackSharpIcon style={{ fontSize: 40 }} />
                                    Go Back
                                </div>
                                <button onClick={this.handleSubmit.bind(this, clickWhom.id, clickWhom.username, clickWhom.avatar)}>Add Friend</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            )
        }
    }
}

export default DiscoverFriend;