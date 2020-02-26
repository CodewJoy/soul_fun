import React, { Component } from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
// import { LogInForm, LogInFormBase } from './LogIn';
import '../../common.css';
import './landing.css';
import { NavLogo_Landing } from '../Header';
// import Soulfun from '../img/funsoul_logo.svg';
// import Soulfun from '../img/landing.jpg';
import Soulfun from '../img/group-of-people-having-fun-together-under-the-sun-708392.jpg';
// import Soulfun from '../img/jump-shot-photography-of-two-women-2597365.jpg';

const LandingPage = () => (
  <>
    {/* <Navigation /> */}
    <Landing />
  </>
);

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showsignup: false,
      showlogin: false
    };
    this.ShowSignUp = this.ShowSignUp.bind(this);
    this.ShowLogIn = this.ShowLogIn.bind(this);
  }
  ShowSignUp() {
    this.setState({ showsignup: !this.state.showsignup })
  }
  ShowLogIn() {
    this.setState({ showlogin: !this.state.showlogin })
  }
  closeSignup(status) {
    this.setState({ showsignup: status })
  }
  closeLogin(status) {
    this.setState({ showlogin: status })
  }
  render() {
    return (
      <div className="landing">
        <div className="navbar">
          <NavLogo_Landing />
          <button className="log-in" onClick={this.ShowLogIn}>LOG IN</button>
        </div>
        <div className="main">
          <div className="container">
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
          <h2>We are not just for dating anymore.</h2>
          <div className="container">
            <div className="intro-3">
            </div>
            <div className="intro-3">
            </div>
            <div className="intro-3">
            </div>
          </div>
          <footer>
            Copyright @2019 Winter
          </footer>
        </div>
        {this.state.showsignup ? <SignUp closeSignup={this.closeSignup.bind(this)} /> : null}
        {this.state.showlogin ? <LogIn closeLogin={this.closeLogin.bind(this)} /> : null}
      </div>
    )
  }
}

export default LandingPage;