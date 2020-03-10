import React, { Component } from 'react';
import { getDistanceSpecifiedTime, getAge } from './utils';

class ShowProfile extends Component {
    render() {
      console.log(this.props);
      const { avatar, username, gender, birthday, timestamp, country, location, language, interest, bio } = this.props.userInfo;
      let timeDistance = getDistanceSpecifiedTime(timestamp);
      let age = getAge(birthday);
      return (
        <div className="view">
          <div className="display">
            <img className="avatar" src={avatar} alt="avatar" />
            <h3>Hey {username}!</h3>
          </div>
          <div className="setting">
            <h3>My profile</h3>
            <p className="name">
              <b>Name&ensp;</b>{username}
            </p>
            <p className="gender">
              <b>Gender&ensp;</b>{gender}
            </p>
            <p className="birthday">
              <b>Birthday&ensp;</b>{birthday}
            </p>
            <p className="age">
              <b>Age&ensp;</b>{age}
            </p>
            <p className="last-online">
              <b>Last online&ensp;</b>{timeDistance}
            </p>
            <p className="language">
              <b>Language&ensp;</b>{language}
            </p>
            <p className="country">
              <b>Country&ensp;</b>{country}
            </p>
            <p className="location">
              <b>Location&ensp;</b>{location}
            </p>
            <p className="bio">
              <b>Intro&ensp;</b>{bio}
            </p>
            <div className="interest">
              <b>Interest&ensp;</b>
              <br/>
              <div className='interest-tag-wrapper'>
                {interest.map(int => (<b className='interest-tag' key={int}>{int}</b>))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
  
  export default ShowProfile;