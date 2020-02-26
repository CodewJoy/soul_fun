/* eslint-disable react/react-in-jsx-scope */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsSharpIcon from '@material-ui/icons/NotificationsSharp';
import { Badge } from '@material-ui/core';

// only member can see this nav
const Navigation = () => (
  <div className="member-navbar">
    <AuthUserContext.Consumer>
      { UserData =>
       <NavigationAuth UserData={UserData}/>
      }
      {/* {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      } */}
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuth extends Component {
  render() {
    console.log('yoyoyo', this.props);
    return (
      <ul>
        <li>
          <Link to={ROUTES.HOME}>
            <Badge badgeContent={ this.props.UserData.f_invitation } color="secondary">
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
        <li>
          {/* <Link to={ROUTES.MESSAGE}> */}
          <NotificationsSharpIcon style={{ fontSize: 30 }} />
          {/* </Link> */}
        </li>
        {/* <li>
      <SignOutButton />
    </li> */}
      </ul>
    );
  }
}

// const NavigationAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.HOME}>
//         <Badge badgeContent={99} color="secondary">
//           <PeopleSharpIcon style={{ fontSize: 30 }} />
//         </Badge>
//       </Link>
//     </li>
//     <li>
//       <Link to={ROUTES.MESSAGE}><ChatIcon style={{ fontSize: 30 }} /></Link>
//     </li>
//     <li>
//       <Link to={ROUTES.PROFILE}><AccountCircleSharpIcon style={{ fontSize: 30 }} /></Link>
//     </li>
//     <li>
//       {/* <Link to={ROUTES.MESSAGE}> */}
//       <NotificationsSharpIcon style={{ fontSize: 30 }} />
//       {/* </Link> */}
//     </li>
//     {/* <li>
//       <SignOutButton />
//     </li> */}
//   </ul>
// );

// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//   </ul>
// );

export default Navigation;