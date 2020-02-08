import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'
import './account.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import Logo from '../img/logo.svg';
// import AvatarImage from '../img/bear.svg';
import AvatarImage from '../img/008-programmer.svg';

const Account = () => (
  <>
    {/* <Navigation /> */}
    <AuthUserContext.Consumer>
      {UserData => (
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
  gender: '',
  birthday: '',
  location: '',
  country: '',
  language: '',
  avatar: '',
  bio: '',
  interest: [],
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
    console.log(this.props.UserData.authUser.uid);
    console.log(this.props.firebase.db);
    this.props.firebase.db.collection("Users").doc(`${this.props.UserData.authUser.uid}`).update(
      this.state
    )
    .then(() => {
      console.log('fin_acc');
      this.setState({
        fin_acc:true
      });
      //this.props.history.push(ROUTES.ACCOUNT);
    })
    // this.props.authUser.toggleTheme(this.state)

  }
  render() {
    console.log("fin_acc", this.state.fin_acc);
    if(this.state.fin_acc){
        return <Redirect to="/home" />;
    }
    return (
      <div className="account">
        <Navbar />
        <div className="main">
          <Display changeProfile={this.changeProfile.bind(this)} />
          <Setting changeProfile={this.changeProfile.bind(this)}
            addToInterest={this.addToInterest.bind(this)} />
        </div>
        <div className="center-button">
          <button onClick={this.saveToDB} >Save</button>
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
        <img className="avatar" src={AvatarImage} alt="avatar" />
        <h5>Joy</h5>
        <p>Joy@gmail.com</p>
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
    return (
      <div className="setting">
        <p>Please select your gender:</p>
        <form className="gender line" onChange={this.onChange}>
          <input type="radio" name="gender" value="male" /> Male<br />
          <input type="radio" name="gender" value="female" /> Female<br />
          <input type="radio" name="gender" value="non-binary" /> Non-binary<br />
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
            <select value={this.props.country} name="country" onChange={this.onChange}>
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
          <Select options={options} />
          {/* <input className="key-in" type="text" placeholder="language" name="language" onChange={this.onChange} /> */}
        </div>

        <p>Pick some topics you are interested in.</p>
        <form className='line'>
          <input type="checkbox" name="interest" value="Movies" onChange={this.onAddInterest} />Movies
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
          <textarea name="bio" rows="10" cols="60" onChange={this.onChange}></textarea>
          <br />
          {/* <input type="submit" value="Save" /> */}
        </form>

      </div>
    )
  }
}

export default Account;