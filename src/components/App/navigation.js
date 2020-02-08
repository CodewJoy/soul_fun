/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../LogOut';
import { AuthUserContext } from '../Session';

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
    {/* <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li> */}
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.PROFILE}>Profile</Link>
    </li>
    <li>
      <Link to={ROUTES.MESSAGE}>Message</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
  </ul>
);

// original one
// const Navigation = () => (
//   <div>
//     <ul>
//       {/* <li>
//         <Link to={ROUTES.LANDING}>Landing</Link>
//       </li> */}
//       <li>
//         <Link to={ROUTES.HOME}>Home</Link>
//       </li>
//       <li>
//         <Link to={ROUTES.ACCOUNT}>Account</Link>
//       </li>
//       <li>
//         <Link to={ROUTES.MESSAGE}>Message</Link>
//       </li>
//       <li>
//         <SignOutButton />
//       </li>
//     </ul>
//   </div>
// );

export default Navigation;