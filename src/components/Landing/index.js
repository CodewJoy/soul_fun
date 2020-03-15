import React, { Component } from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
import '../../common.css';
import './landing.css';
import { NavLogo_Landing } from '../Header';
import Soulfun from '../img/group-of-people-having-fun-together-under-the-sun-708392.jpg';
import { INTERESTS } from '../../constants/factor.js';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showsignup: false,
      showlogin: false,
      hobby: {
        'Travel': true, 'Diving': false, 'Hiking': true, 'Movies': false, 'Art': true, 'Photography': false, 'Music': true, 'Animals': false,
        'Nature': true, 'Reading': false, 'Writing': true, 'Sports': false,'Fitness': true, 'Language': false, 'Cooking': true, 'Coding':  false,'Gaming':true, 'Fashion': false,
        'Psychology': true, 'Philosophy': false, 'Investing': true, 'Career': false, 'Coffee': true, 'Tea': false, 'Wine': true,
      },
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
        <div className="navbar-landing">
          <NavLogo_Landing />
          <button className="log-in" onClick={this.ShowLogIn}>LOG IN</button>
        </div>
        <div className="main">
          <div className="container">
            <div className="web-intro">
              <h2>SouLFun - Meet fun souls here!</h2>
              <p>SouLFun lets you meet friends with common interests and exchange thoughts on the same passion.</p>
              <sub>*By clicking Sign Up, you agree to our Terms, including our Privacy Policy and Cookie Policy.</sub>
              <div className="center-button">
                <button onClick={this.ShowSignUp}>SIGN UP</button>
              </div>
            </div>
            <div className="graphics">
              <img className="soulfun" src={Soulfun} alt="Soulfun" />
            </div>
          </div>
          <div className="center-button">
            <h2>Share your passion to the world.</h2>
          </div>
          <div className="container reverse">
            <div className="web-intro tag">
              <h3>Use Interest Tags to find the friends with the same hobbies with you.</h3>
              <form className='interest line'>
                {INTERESTS.map(item => (
                  <div key={item}>
                    <input type="checkbox" name={item} id={item} value={item} checked={this.state.hobby[item]} />
                    <label htmlFor={item}>
                      <div className='interest-tag'>
                        <b>{item}</b>
                      </div>
                    </label>
                  </div>
                ))}
              </form>
            </div>
            <div className="graphics interest-intro">
              <p>Matches are based on language & commonly interested topics. Practice a language, exchange thoughts on the same passion.</p>
            </div>
          </div>
          <footer className="footer">
            Special Thanks&emsp;|&emsp;Email Support
            <br/>
            <p className="gray-font">© SouLFun. All Rights Reserved</p>
          </footer>
        </div>
        {this.state.showsignup ? <SignUp closeSignup={this.closeSignup.bind(this)} /> : null}
        {this.state.showlogin ? <LogIn closeLogin={this.closeLogin.bind(this)} /> : null}
      </div>
    )
  }
}

export default Landing;