/* eslint-disable react/react-in-jsx-scope */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import ChatIcon from '@material-ui/icons/Chat';
import { Badge } from '@material-ui/core';

// only member can see this nav
const Navigation = () => (
  <div className="member-navbar">
    <AuthUserContext.Consumer>
      {userData =>
        <NavigationAuth userData={userData} />
      }
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuth extends Component {
  render() {
    return (
      <ul className="dropdown-content">
        <li>
          <Link to={ROUTES.HOME}>
            <Badge badgeContent={this.props.userData.friendInvitation} color="primary">
              <PeopleSharpIcon style={{ fontSize: 30 }} />
            </Badge>
          </Link>
        </li>
        <li>
          <Link to={ROUTES.MESSAGE}><ChatIcon style={{ fontSize: 30 }} /></Link>
        </li>
        <li>
          <Link to={ROUTES.PROFILE}><AccountCircleSharpIcon style={{ fontSize: 30 }} /></Link>
        </li>
      </ul>
    );
  }
}

export default Navigation;