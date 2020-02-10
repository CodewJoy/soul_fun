import React, { Component } from 'react';
// import Navigation from '../App/navigation.js';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'
import './account.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';
// import AvatarImage from '../img/avatar.svg';

const Account = () => (
  <>
    {/* <Navigation /> */}
    <AuthUserContext.Consumer>
      {(UserData) => (
        <FirebaseContext.Consumer>
          {(firebase) => <AccountBase
            UserData={UserData} firebase={firebase} />}
        </FirebaseContext.Consumer>
      )}
    </AuthUserContext.Consumer>
  </>
);

const INITIAL_STATE = {
  // username: 
  gender: 'male',
  birthday: "1995-01-01",
  location: 'taiwan',
  country: 'taiwan',
  language: '',
  avatar: 'https://firebasestorage.googleapis.com/v0/b/personal-project-b5b0e.appspot.com/o/002-male.svg?alt=media&token=e78987fe-00b1-4848-aee7-dc621352875d',
  bio: '',
  interest: [],
  items: [
    { text: 'coding', checked: false },
    { text: 'reading', checked: false },
    { text: 'diveing', checked: false },
  ],
  isLoaded: false,
  fin_acc: false
};
const options = [
  { value: 'english', label: 'English' },
  { value: 'franch', label: 'Franch' },
  { value: 'chinese', label: 'Chinese' }
]

class AccountBase extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { ...INITIAL_STATE };
    this.changeProfile = this.changeProfile.bind(this);
    this.addToInterest = this.addToInterest.bind(this);
    this.saveToDB = this.saveToDB.bind(this);
  }
  changeProfile(value) {
    this.setState(value, () => {
      console.log(this.state)
    });
    console.log(this.props)
    // this.props.UserData.updateUserDate(value)
  }
  addToInterest(value) {
    this.setState(state => {
      let interest = state.interest.concat(value);
      return { interest };
    }, () => {
      console.log(this.state);
    });
  }

  // onToggle(index){
  //   let newItems = this.state.items.slice();
	// 	newItems[index].checked = !newItems[index].checked;
  // 	this.setState({
  //   	items: newItems
  //   },()=>{console.log(this.state)})
  // }
  saveToDB(){
    const { gender, birthday, location, country, language, avatar, bio, interest} = this.state;

    console.log(this.props.UserData.authUser.uid);
    console.log(this.props.firebase.db);
    this.props.firebase.db.collection("Users").doc(`${this.props.UserData.authUser.uid}`).update(
      // this.state
      { gender: gender, birthday, location,
      country,language, avatar,
      bio, interest }
    )
      .then(() => {
        console.log('fin_acc');
        this.setState({
          fin_acc: true
        });
        //this.props.history.push(ROUTES.ACCOUNT);
      })
  }
  render() {
    console.log("fin_acc", this.state.fin_acc);
    if (this.state.fin_acc) {
      return <Redirect to="/home" />;
    }
    // const { isLoaded } = this.state
    // if (!isLoaded) {
    //   return <div>Loading...</div>
    // } else {
    console.log('account:', this.props);
    return (
      <div className="account">
        <Navbar />
        <div className="main">
          {/* <Display changeProfile={this.changeProfile.bind(this)}  /> */}
          <Display changeProfile={this.changeProfile.bind(this)} username={this.props.UserData.userInfo.username} userInfo={this.state}/>
          <Setting changeProfile={this.changeProfile.bind(this)}
            addToInterest={this.addToInterest.bind(this)} userInfo={this.state} />
        </div>
        {/* <ul>
          {this.state.items.map((item, i) =>
                  	<li key={i}>
              {item.text}
          	  <input type="checkbox" onChange={this.onToggle.bind(this, i)} />
          	</li>
          )}
    	  </ul> */}
        <div className="center-button">
          <button onClick={this.saveToDB} >Save</button>
        </div>
      </div>
    );
    // }
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
    // console.log(this.props)
    return (
      <div className="display">
        {/* <img className="avatar" src={AvatarImage} alt="avatar" /> */}
        <img className="avatar" src={this.props.userInfo.avatar} alt="avatar" />
        <h5>Hey {this.props.username}!</h5>
      </div>
    )
  }
}

class Setting extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAddInterest = this.onAddInterest.bind(this);
  }
  onChange(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
    this.props.changeProfile({ [event.target.name]: event.target.value });
  }
  onAddInterest(event) {
    this.props.addToInterest(event.target.value);
  }
  render() {
    // console.log(this.props)
    return (
      <div className="setting">
        <p>Please select your gender:</p>
        <form className="gender line">
          <input type="radio" name="gender" value="male" checked={this.props.userInfo.gender === "male"} onChange={this.onChange} /> Male<br />
          <input type="radio" name="gender" value="female" checked={this.props.userInfo.gender === "female"} onChange={this.onChange} /> Female<br />
          <input type="radio" name="gender" value="non-binary" checked={this.props.userInfo.gender === "non-binary"} onChange={this.onChange} /> Non-binary<br />
          {/* <input type="submit" value="Save" /> */}
        </form>
        <br />
        <form className="birthday" >
          <p>When is your birthday?</p>
          <input type="date" name="birthday" value={this.props.userInfo.birthday} onChange={this.onChange} />
          <p>You must be at least 18 years old to use SOULFUN.</p>
          {/* <input type="submit" value="Save"/> */}
        </form>
        <br />
        <div className="country">
          <p>Where are you from?</p>
          <form>
            <select value={this.props.userInfo.country} name="country" onChange={this.onChange}>
              <option value="Taiwan">Taiwan</option>
              <option value="U.S.">U.S.</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
            </select>
          </form>
          {/* <input className="key-in" type="text" placeholder="country" name="country" onChange={this.onChange}/> */}
        </div>
        <div className="location">
          <p>Where do you primarily live?</p>
          <form>
            <select value={this.props.userInfo.location} name="location" onChange={this.onChange}>
              <option value="Taiwan">Taiwan</option>
              <option value="U.S.">U.S.</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
            </select>
          </form>
          {/* <input className="key-in" type="text" placeholder="location" name="location" onChange={this.onChange}/> */}
        </div>

        <div className="language">
          <p>what kind of language do you speak?</p>
          <Select options={options} onChange={this.onChange}/>
          {/* <input className="key-in" type="text" placeholder="language" name="language" onChange={this.onChange} /> */}
        </div>

        <p>Pick some topics you are interested in.</p>
        <form className='interest line'>
          <input type="checkbox" name="interest" value="Movies"  onChange={this.onAddInterest} />Movies
            <br />
          <input type="checkbox" name="interest" value="Pets" onChange={this.onAddInterest} />Pets
            <br />
          <input type="checkbox" name="interest" value="Nature" onChange={this.onAddInterest} />Nature
            <br />
          <input type="checkbox" name="interest" value="Travel" onChange={this.onAddInterest} />Travel
            <br />
          <input type="checkbox" name="interest" value="Music" onChange={this.onAddInterest} />Music
            <br />
          <input type="checkbox" name="interest" value="Coding" onChange={this.onAddInterest} />Coding
            <br />
          {/* <input type="submit" value="Save" /> */}
        </form>
        <form>
          <p>Intro</p>
          <textarea name="bio" value={this.props.userInfo.bio} rows="10" cols="60" onChange={this.onChange}></textarea>
          <br />
          {/* <input type="submit" value="Save" /> */}
        </form>

      </div>
    )
  }
}

export default Account;