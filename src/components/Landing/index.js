import React, { Component } from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
// import { LogInForm, LogInFormBase } from './LogIn';
import '../../common.css';
import './landing.css';
import Logo from '../img/logo.svg';
// import Navigation from '../App/navigation.js';
import Soulfun from '../img/soulfun_v2.svg';
// import Soulfun from '../img/animal_planet_2.svg';

const LandingPage = () => (
  <>
    <Landing />
  </>
);

class Landing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showsignup: false,
      showlogin: false
    }
    this.ShowSignUp = this.ShowSignUp.bind(this)
    this.ShowLogIn = this.ShowLogIn.bind(this)
  }
  ShowSignUp() {
    this.setState({ showsignup: !this.state.showsignup })
  }
  ShowLogIn() {
    this.setState({ showlogin: !this.state.showlogin })
  }
  closeLogin(status) {
    this.setState({ showlogin: status })
  }
  closeSignup(status) {
    this.setState({ showsignup: status })
  }

  render() {
    return (
      <div className="landing">
        <div className="navbar">
          <div className="logo">
            <img className="logo-img" src={Logo} alt="Logo" />
            <h3>SOULFUN</h3>
          </div>
          <button className="log-in" onClick={this.ShowLogIn}>LOG IN</button>
        </div>
        <div className="main">
          <div className="web-intro">
            <h2>SOULFUN - Meet fun souls here!</h2>
            <p>SOULFUN lets you meet friends with common interests and exchange thoughts on the same passion.</p>
     
            <p>By clicking Sign Up, you agree to our Terms, including our Privacy Policy and Cookie Policy.</p>
            <div className="center-button">
              <button onClick={this.ShowSignUp}>SIGN UP</button>
            </div>
          </div>
          <div className="graphics">
            <img className="soulfun" src={Soulfun} alt="Soulfun" />
          </div>
        </div>
        { this.state.showsignup ? <SignUp closeSignup = {this.closeSignup.bind(this)} />: null }
        { this.state.showlogin ? <LogIn closeLogin = {this.closeLogin.bind(this)}/>: null }
      </div>
    )
  }
}

export default LandingPage;