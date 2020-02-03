import React, { Component } from 'react';
import SignUp from './SignUp';
import LogIn from './LogIn';
import '../../common.css';
import './landing.css';
import Logo from '../img/logo.svg';
import Soulfun from '../img/soulfun_v2.svg';
// import Soulfun from '../img/animal_planet_2.svg';
import Navigation from '../App/navigation.js';

const LandingPage = () => (
  <div className="view">
    <Landing />
  </div>
);

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <Navigation />
        <div className="navbar">
          <div className="logo">
            <img className="logo-img" src={Logo} alt="Logo" />
            <h3>SOULFUN</h3>
          </div>
          <button className="log-in">LOG IN</button>
        </div>
        <div className="main">
          <div className="web-intro">
            <h2>SOULFUN - I SOUL U</h2>
            <p>SOULFUN lets you meet friends with common interests and exchange thoughts on the same passion.</p>
            <p>Meet fun souls here!</p>

            <p>By clicking Sign Up, you agree to our Terms, including our Privacy Policy and Cookie Policy.</p>
            <div className="center-button">
              <button >SIGN UP</button>
            </div>
          </div>
          <div className="graphics">
            <img className="soulfun" src={Soulfun} alt="Soulfun" />
          </div>
        </div>
        <SignUp />
        <LogIn />
      </div>
    )
  }
}

export default LandingPage;