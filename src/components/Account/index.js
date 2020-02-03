import React, { Component } from 'react';
import Navigation from '../App/navigation.js';
import SignOutButton from '../LogOut';


const Account = () => (
  <div className='main'>
      <Navigation />
      <h1>Account</h1>
      <SignOutButton />
  </div>
);

export default Account;