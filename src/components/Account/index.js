import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './account.css';
import { FirebaseContext } from '../../index.js';
import { AuthUserContext } from '../Session';
import { INTERESTS } from '../../constants/factor.js';
import { COUNTRIES } from '../../constants/factor.js';
import { LANGUAGES } from '../../constants/factor.js';
import { Navbar_Account } from '../Header';
import AddIcon from '@material-ui/icons/Add';


import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';

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
  }
  render() {
    console.log(this.props);
    return (
      <div className="account">
        <Navbar_Account />
        <Setting userInfo={this.props.UserData.userInfo} firebase={this.props.firebase} />
      </div>
    );
  }
}

const INITIAL_STATE = {
  // username: 
  gender: '',
  birthday: '',
  location: '',
  country: '',
  language: '',
  avatar: '',
  bio: '',
  // interest checked record
  hobby: {
    'Travel': false, 'Diving': false, 'Hiking': false, 'Movies': false, 'Art': false, 'Photography': false, 'Music': false, 'Animals': false,
    'Nature': false, 'Reading': false, 'Writing': false, 'Sports': false, 'Fitness': false, 'Language': false, 'Cooking': false, 'Coding': false, 'Gaming': false, 'Fashion': false,
    'Psychology': false, 'Philosophy': false, 'Investing': false, 'Career': false, 'Coffee': false, 'Tea': false, 'Wine': false
  },
  // used to render
  interest: [],
  isLoaded: false,
  fin_acc: false,
  image: null,
  // progress:0
};

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.saveToDB = this.saveToDB.bind(this);
    this.getValue = this.getValue.bind(this);
    this.addInterest = this.addInterest.bind(this);
    this.getSelectValue = this.getSelectValue.bind(this);
    this.getLocationValue = this.getLocationValue.bind(this);
    this.getLanValue = this.getLanValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleUpload = this.handleUpload.bind(this);
  }
  saveToDB() {
    const { gender, birthday, location, country, language, avatar, bio, interest, hobby } = this.state;
    // console.log(this.props.UserData.authUser.uid);
    // console.log(this.props.firebase.db);
    if ( gender==='' || birthday === '' || location === ''|| country === '' || language === '' || avatar === '' || bio === '' || interest === []) {
      alert('You have not finished the form.');
    } else {
      this.props.firebase.db.collection("Users").doc(`${this.props.userInfo.id}`).update(
        {
          gender, birthday, location,
          country, language, avatar,
          bio, hobby, interest
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
  }

  getValue(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value }, () => {
      console.log(this.state)
    });
  }
  // used for autocomplete
  getSelectValue(e) {
    // console.log(e.target);
    // console.log(e.target.value)
    // console.log(e.target.id)
    // console.log(e.target.textContent)
    // console.log(e.target.label)
    // console.log(e.target.label)
    // console.log(e.target.name)
    this.setState({ country: e.target.textContent }, () => {
      console.log(this.state)
    });
  }
  getLocationValue(e) {
    this.setState({ location: e.target.textContent }, () => {
      console.log(this.state)
    });
  }
  getLanValue(e) {
    // console.log(e.target);
    // console.log(e.target.value)
    // console.log(e.target.id)
    // console.log(e.target.textContent)
    // console.log(e.target.label)
    // console.log(e.target.name)
    this.setState({ language: e.target.textContent }, () => {
      console.log(this.state)
    });
  }
  addInterest(e) {
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
    }), () => {
      let interest = [];
      let hobby = this.state.hobby;
      for (const key in hobby) {
        if (hobby[key]) {
          // console.log(key)
          interest.push(key);
        }
      }
      console.log(interest)
      this.setState({ interest: interest })
    })
  }
  handleChange(e) {
    const { firebase } = this.props;
    console.log(e.target)
    console.log(e.target.files)
    console.log(this.props)
    // console.log(e.target.files[0])
    if (e.target.files[0]) {
      // Get file
      const image = e.target.files[0];
      // Create a storage ref
      let storageRef = firebase.storage.ref('avatar_'+ image.name);
      // Upload file
      let task = storageRef.put(image);

      task.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case firebase.storage.TaskState.PAUSED: // or 'paused'
        //     console.log('Upload is paused');
        //     break;
        //   case firebase.storage.TaskState.RUNNING: // or 'running'
        //     console.log('Upload is running');
        //     break;
        // }
      }, function(error) {
        console.log(error);
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          this.setState({ image: image, avatar:downloadURL}, () => {
            console.log(this.state)
          });
        });
      });
    }
  }
  // handleUpload() {
  //   const { image } = this.state;
  //   const uploadTask = this.props.firebase.ref(`images/${image.name}`).put(image);
  // }
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
        <div className="view">
          <div className="setting-1">
            <div className="upload">
              <h4>Hey {this.props.userInfo.username}! Share more about you :)</h4>
              <div className="border">
                <input type="file"
                  id="avatar" name="avatar" onChange={this.handleChange}/>
                <label htmlFor='avatar'>
                  {this.state.avatar=== "" ? (
                  <div className="avatar">
                    <AddIcon style={{ size: 60 }} />
                  </div>) :
                  (<div className="avatar">
                    <img src={this.state.avatar} alt="avatar"/>
                  </div>)}
                </label>
              </div>
              {/* <img className="avatar" src={this.props.userInfo.avatar} alt="avatar" /> */}
              <p>
                <sub>
                  *Upload a picture that represents you as your avatar.
                </sub>
                <br/>
                <sub>
                  *The ideal image shape should be square look.
                </sub>
              </p>
              {/* <button onClick={this.handleUpload}>Save Picture</button> */}
            </div>
            <p><b>Gender</b></p>
            <form className="gender line">
              <input type="radio" name="gender" value="male" checked={this.state.gender === "male"} onChange={this.getValue} />Male&emsp;<br />
              <input type="radio" name="gender" value="female" checked={this.state.gender === "female"} onChange={this.getValue} /> Female&emsp;<br />
              <input type="radio" name="gender" value="non-binary" checked={this.state.gender === "non-binary"} onChange={this.getValue} /> Non-binary&emsp;<br />
              {/* <input type="submit" value="Save" /> */}
            </form>
            <br />
            <form className="birthday" >
              <p><b>When is your birthday?</b></p>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  // value={selectedDate}
                  // onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider> */}

              <input type="date" name="birthday" value={this.state.birthday} onChange={this.getValue} required />
              <p>
                <sub>*You must be at least 18 years old to use SOULFUN.</sub>
              </p>
            </form>
            <div className="language">
              <p><b>what kind of language do you speak?</b></p>
              <Autocomplete
                // is value here meaningful?
                // value='Taiwan'
                value={this.state.language}
                // name="location"
                onChange={this.getLanValue}
                id="language"
                options={LANGUAGES}
                getOptionLabel={LANGUAGES => LANGUAGES}
                style={{ width: 300 }}
                renderInput={params => <TextField {...params} label="Language" variant="outlined" />}
              />
              {/* <Autocomplete
                multiple
                onChange={this.getLanValue}
                id="tags-outlined"
                options={LANGUAGES}
                getOptionLabel={option => option}
                // defaultValue={this.state.birthday}
                filterSelectedOptions
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Languages"
                    // placeholder="Favorites"
                  />
                )}
              /> */}
              {/* <input className="key-in" type="text" placeholder="language" name="language" onChange={this.getValue} /> */}
            </div>
            <br />
          </div>
          <div className="setting-2">
            <div className="country">
              <p><b>Where are you from?</b></p>
              <Autocomplete
                // is value here meaningful?
                // value='Taiwan'
                value={this.state.country}
                name="country"
                onChange={this.getSelectValue}
                id="country"
                options={COUNTRIES}
                getOptionLabel={COUNTRIES => COUNTRIES}
                style={{ width: 300 }}
                renderInput={params => <TextField {...params} label="Country" variant="outlined" />}
              />
              {/* <form>
                <select value={this.state.country} name="country" onChange={this.getValue}>
                  <option value="Taiwan">Taiwan</option>
                  <option value="U.S.">U.S.</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </form> */}
            </div>
            <div className="location">
              <p><b>Where do you primarily live?</b></p>
              <Autocomplete
                // is value here meaningful?
                // value='Taiwan'
                value={this.state.location}
                // name="location"
                onChange={this.getLocationValue}
                id="location"
                options={COUNTRIES}
                getOptionLabel={COUNTRIES => COUNTRIES}
                style={{ width: 300 }}
                renderInput={params => <TextField {...params} label="Location" variant="outlined" />}
              />
              {/* <form>
                <select value={this.state.location} name="location" onChange={this.getValue}>
                  <option value="Taiwan">Taiwan</option>
                  <option value="U.S.">U.S.</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </form> */}
              {/* <input className="key-in" type="text" placeholder="location" name="location" onChange={this.getValue}/> */}
            </div>
            <br />
            <p><b>Pick some topics you are interested in.</b></p>
            <p>
              <sub>*We will use them to find the friend with common interests.</sub>
            </p>
            <form className='interest line'>
              {INTERESTS.map(item => (
                <div key={item}>
                  <input type="checkbox" name={item} id={item} value={item} onChange={this.addInterest} checked={this.state.hobby[item]} />
                  <label htmlFor={item}>
                    <div className='interest-tag'>
                      <b>{item}</b>
                    </div>
                  </label>
                </div>
              ))}
            </form>
            <form className='bio'>
              <p><b>About Me</b></p>
              <textarea name="bio" value={this.state.bio} rows="8" cols="80" onChange={this.getValue}></textarea>
              <br />
              {/* <input type="submit" value="Save" /> */}
            </form>
          </div>
        </div>
        <div className="center-button">
          <button onClick={this.saveToDB}>Save Profile</button>
        </div>
      </div>
    )
  }
}

export default Account;