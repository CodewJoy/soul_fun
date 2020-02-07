import React, { Component } from 'react';
import Navigation from '../App/navigation.js';
import './account.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';
// import AvatarImage from '../img/bear.svg';
import AvatarImage from '../img/008-programmer.svg';

const Account = () => (
  <>
    <Navigation />
      <AuthUserContext.Consumer>
        {authUser => (
          <FirebaseContext.Consumer>
            {(firebase) => <AccountBase authUser={authUser} firebase={firebase} />}
          </FirebaseContext.Consumer>
        )}
      </AuthUserContext.Consumer>
  </>
);

const INITIAL_STATE = {
  gender:'',
  birthday:'',
  location:'',
  country:'',
  language:'',
  avatar:'',
  bio:'',
  interest:[]
};

class AccountBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.changeProfile = this.changeProfile.bind(this);
    this.addToInterest = this.addToInterest.bind(this);
    this.saveToDB = this.saveToDB.bind(this);
  }
  changeProfile(value) {
    this.setState(value, () => {
      console.log(this.state)
    });
  }
  addToInterest(value) {
    this.setState(state => {
      let interest = state.interest.concat(value);
      return { interest };
    }, () => {
      console.log(this.state);
    });
  }
  saveToDB() {
    console.log(this.props);
    console.log(this.props.authUser.uid);
    console.log(this.props.firebase.db);
    this.props.firebase.db.collection("Users").doc(`${this.props.authUser.uid}`).update(
      this.state
    )
    // .then() {
    // redirect to homepage
    // }
  }
  render() {
    return (
      <div className="account">
        <div className="navbar">
          <div className="logo">
            <img className="logo-img" src={Logo} alt="Logo" />
            <h3>SOULFUN</h3>
          </div>
        </div>
        <div className="main">
          <Profile changeProfile = {this.changeProfile.bind(this)} 
            addToInterest = {this.addToInterest.bind(this)}/>
          <Setting changeProfile = {this.changeProfile.bind(this)}/>
        </div>
        <div className="center-button">
          <button onClick={this.saveToDB} >Save</button>
        </div>
      </div>
    );
  }
}

class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAddInterest = this.onAddInterest.bind(this);
  }
  onChange(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
    this.props.changeProfile({[event.target.name]: event.target.value});
  }
  onAddInterest(event) {
    this.props.addToInterest(event.target.value);
  }
  render() {
    return (
      <div className="profile">
        <div className="display">
          <img className="avatar" src={AvatarImage} alt="avatar" />
          <h5>Joy</h5>
          <p>Joy@gmail.com</p>
        </div>
        <p>Pick some topics you are interested in.</p>
        <form className='line'>
          <input type="checkbox" name="interest" value="Movies" onChange={this.onAddInterest}/>Movies
            <br />
          <input type="checkbox" name="interest" value="Pets" onChange={this.onAddInterest}/>Pets
            <br />
          <input type="checkbox" name="interest" value="Nature" onChange={this.onAddInterest}/>Nature
            <br />
          <input type="checkbox" name="interest" value="Travel" onChange={this.onAddInterest}/>Travel
            <br />
          <input type="checkbox" name="interest" value="Music" onChange={this.onAddInterest}/>Music
            <br />
          <input type="checkbox" name="interest" value="Coding" onChange={this.onAddInterest}/>Coding
            <br />
          {/* <input type="submit" value="Save" /> */}
        </form>
        <form>
          <p>Intro</p>
          <textarea name="bio" rows="10" cols="60" onChange={this.onChange}></textarea>
          <br />
          {/* <input type="submit" value="Save" /> */}
        </form>
      </div>
    )
  }
}

class Setting extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
    this.props.changeProfile({[event.target.name]: event.target.value});
  }
  render() {
    return (
      <div className="setting">
        <form className="gender" onChange={this.onChange}>
          <p>Please select your gender:</p>
          <input type="radio" name="gender" value="male" /> Male<br />
          <input type="radio" name="gender" value="female" /> Female<br />
          <input type="radio" name="gender" value="other" /> Other<br />
          {/* <input type="submit" value="Save" /> */}
        </form>

        <form className="birthday" onChange={this.onChange}>
          <p>When were you born?</p>
          <input type="date" name="birthday" />
          {/* <input type="submit" value="Save"/> */}
        </form>

        <div className="location-born">
          <p>Where are you from?</p>
          <form>
            <select name="country" onChange={this.onChange}>
              <option value="Taiwan">Taiwan</option>
              <option value="U.S.">U.S.</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
            </select>
          </form>
          {/* <input className="key-in" type="text" placeholder="country" name="country" onChange={this.onChange}/> */}
        </div>

        <div className="location-live">
          <p>Where do you primarily live?</p>
          <form>
            <select name="location" onChange={this.onChange}>
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
          <input className="key-in" type="text" placeholder="language" name="language"  onChange={this.onChange}/>
        </div>
      </div>
    )
  }
}

export default Account;