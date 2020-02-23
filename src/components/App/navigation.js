/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsSharpIcon from '@material-ui/icons/NotificationsSharp';

// only member can see this nav
const Navigation = () => (
  <div className="member-navbar">
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.HOME}><PeopleSharpIcon style={{ fontSize: 35 }}/></Link>
    </li>
    <li>
      <Link to={ROUTES.MESSAGE}><ChatIcon style={{ fontSize: 35 }}/></Link>
    </li>
    <li>
      <Link to={ROUTES.PROFILE}><AccountCircleSharpIcon style={{ fontSize: 35 }}/></Link>
    </li>
    <li>
      {/* <Link to={ROUTES.MESSAGE}> */}
        <NotificationsSharpIcon style={{ fontSize: 35 }}/>
      {/* </Link> */}
    </li>
    {/* <li>
      <SignOutButton />
    </li> */}
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
  </ul>
);

export default Navigation;