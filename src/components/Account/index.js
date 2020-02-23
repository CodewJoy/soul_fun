import React, { Component } from 'react';
// import Navigation from '../App/navigation.js';
import { Redirect } from 'react-router-dom';
import Select from 'react-select'
import './account.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import { INTERESTS } from '../../constants/factor.js';
import Logo from '../img/logo.svg';
import AddIcon from '@material-ui/icons/Add';


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

class AccountBase extends Component {
  constructor(props) {
    super(props);
    console.log(props);

  }

  render() {
    return (
      <div className="account">
        <Navbar />

        <Setting username={this.props.UserData.userInfo.username} />
        {/* <Setting changeProfile={this.changeProfile.bind(this)} username={this.props.UserData.userInfo.username}
            addToInterest={this.addToInterest.bind(this)} userInfo={this.state} /> */}

        {/* <ul>
          {this.state.items.map((item, i) =>
            <li key={i}>
              {item.text}
              <input type="checkbox" onChange={this.onToggle.bind(this, i)} />
            </li>
          )}
        </ul> */}
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

const INITIAL_STATE = {
  // username: 
  gender: 'male',
  birthday: "1995-01-01",
  location: '',
  country: '',
  language: '',
  avatar: '',
  bio: '',
  hobby: {
    'Travel': false, 'Diving': false, 'Hiking': false, 'Movies': false, 'Art': false, 'Photography': false, 'Music': false, 'Animals': false,
    'Nature': false, 'Reading': false, 'Writing': false, 'Sports': false, 'Fitness': false, 'Language': false, 'Cooking': false, 'Coding': false, 'Gaming': false, 'Fashion': false,
    'Psychology': false, 'Philosophy': false, 'Investing': false, 'Career': false, 'Coffee': false, 'Tea': false, 'Wine': false
  },
  interest: [],
  isLoaded: false,
  fin_acc: false
};
const options = [
  { value: 'english', label: 'English' },
  { value: 'franch', label: 'Franch' },
  { value: 'chinese', label: 'Chinese' }
]

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.addToInterest = this.addToInterest.bind(this);
    this.saveToDB = this.saveToDB.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.onAddInterest = this.onAddInterest.bind(this);
    this.AddHobby = this.AddHobby.bind(this);
  }
  saveToDB() {
    const { gender, birthday, location, country, language, avatar, bio, interest } = this.state;

    console.log(this.props.UserData.authUser.uid);
    console.log(this.props.firebase.db);
    this.props.firebase.db.collection("Users").doc(`${this.props.UserData.authUser.uid}`).update(
      // this.state
      {
        gender: gender, birthday, location,
        country, language, avatar,
        bio, interest
      }
    )
      .then(() => {
        console.log('fin_acc');
        this.setState({
          fin_acc: true
        });
        //this.props.history.push(ROUTES.ACCOUNT);
      })
  }

  onChange(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value }, () => {
      console.log(this.state)
    });
    // console.log(this.props)
    // this.props.changeProfile({ [event.target.name]: event.target.value });
  }
  AddHobby(e) {
    const key = e.target.value;
    console.log('hobby', key);
    console.log('hobby', this.state);
    // console.log('hobby',this.state.hobby);
    // console.log('hobby',this.state.hobby[key]);
    this.setState(state => ({
      hobby: {
        ...state.hobby,
        [key]: !state.hobby[key]
      }
    }))
    this.addToInterest()
  }
  addToInterest() {
    let interest = [];
    let hobby = this.state.hobby;
    for (const key in hobby) {
      if (hobby[key]) {
        interest.push[key];
      }
    }
    console.log(interest)
    console.log(this.state.interest)
    // this.setState(state => {
    //   let interest = state.interest.concat(value);
    //   return { interest };
    // }, () => {
    //   console.log(this.state);
    // });
  }
  render() {
    console.log(this.props)
    console.log(this.state)
    console.log("fin_acc", this.state.fin_acc);
    if (this.state.fin_acc) {
      return <Redirect to="/home" />;
    }
    console.log('account:', this.props);
    return (
      <div className="main">
        <br/>
        {/* <h3>Welcome {this.props.username}! Share more about you :)</h3> */}
        <div className="view">
          <div className="setting-1">
            <div className="upload">
              <div className="border">
                <div className="avatar">
                  <AddIcon style={{ size: 60 }} />
                </div>
              </div>
              {/* <img className="avatar" src={this.props.userInfo.avatar} alt="avatar" /> */}
              <p>
                <sub>
                  *Upload a picture that represents you.
              </sub>
              </p>
            </div>
            <p><b>Gender</b></p>
            <form className="gender line">
              <input type="radio" name="gender" value="male" checked={this.state.gender === "male"} onChange={this.onChange} />Male&emsp;<br />
              <input type="radio" name="gender" value="female" checked={this.state.gender === "female"} onChange={this.onChange} /> Female&emsp;<br />
              <input type="radio" name="gender" value="non-binary" checked={this.state.gender === "non-binary"} onChange={this.onChange} /> Non-binary&emsp;<br />
              {/* <input type="submit" value="Save" /> */}
            </form>
            <br />
            <form className="birthday" >
              <p><b>When is your birthday?</b></p>
              <input type="date" name="birthday" value={this.state.birthday} onChange={this.onChange} required />
              <p>
                <sub>*You must be at least 18 years old to use SOULFUN.</sub>
              </p>
            </form>
            <div className="country">
              <p><b>Where are you from?</b></p>
              <form>
                <select value={this.state.country} name="country" onChange={this.onChange}>
                  <option value="Taiwan">Taiwan</option>
                  <option value="U.S.">U.S.</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </form>
              {/* <input className="key-in" type="text" placeholder="country" name="country" onChange={this.onChange}/> */}
            </div>
            <br />
            <div className="location">
              <p><b>Where do you primarily live?</b></p>
              <form>
                <select value={this.state.location} name="location" onChange={this.onChange}>
                  <option value="Taiwan">Taiwan</option>
                  <option value="U.S.">U.S.</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </form>
              {/* <input className="key-in" type="text" placeholder="location" name="location" onChange={this.onChange}/> */}
            </div>
            <br />
          </div>
          <div className="setting-2">
            <div className="language">
              <p><b>what kind of language do you speak?</b></p>
              <Select options={options} onChange={this.onChange} />
              {/* <input className="key-in" type="text" placeholder="language" name="language" onChange={this.onChange} /> */}
            </div>
            <br />
            <p><b>Pick some topics you are interested in.</b></p>
            <p>
              <sub>*We will use them to find the friend with common interests.</sub>
            </p>
            <form className='interest line'>
              {INTERESTS.map(item => (
                <div key={item}>
                  <input type="checkbox" name={item} id={item} value={item} onChange={this.AddHobby} checked={this.state.hobby[item]} />
                  <label htmlFor={item}>
                    <div className='interest-tag'>
                      <b>{item}</b>
                    </div>
                  </label>
                </div>
              ))}
            </form>
            <br />
            <form>
              <p><b>About Me</b></p>
              <textarea name="bio" value={this.state.bio} rows="10" cols="60" onChange={this.onChange}></textarea>
              <br />
              {/* <input type="submit" value="Save" /> */}
            </form>
          </div>
        </div>
        <div className="center-button">
          <button onClick={this.saveToDB} >Save</button>
        </div>
      </div>
    )
  }
}

export default Account;