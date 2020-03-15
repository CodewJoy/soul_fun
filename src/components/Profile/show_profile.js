import React, { Component } from 'react';
import { getDistanceSpecifiedTime, getAge } from './utils';

class ShowProfile extends Component {
    render() {
      const { avatar, username, gender, birthday, timestamp, country, location, language, interest, bio } = this.props.userInfo;
      let timeDistance = getDistanceSpecifiedTime(timestamp);
      let age = getAge(birthday);
      if (avatar) {
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
      } else {
        return (
          <div className="view">
            <div className="display">
              <img className="avatar" src={'https://firebasestorage.googleapis.com/v0/b/personal-project-b5b0e.appspot.com/o/avatar_userundefined.png?alt=media&token=3bf1cfa1-c485-4fd1-83df-ea8bfc837eea'} alt='avatar' />
              <h3>You hav not finished the profile form last time, click Edit button to finish it.</h3>
              {/* <h3>Hey {''}!</h3> */}
            </div>
            <div className="setting">
              <h3>My profile</h3>
              <p className="name">
                <b>Name&ensp;</b>{'No value'}
              </p>
              <p className="gender">
                <b>Gender&ensp;</b>{'No value'}
              </p>
              <p className="birthday">
                <b>Birthday&ensp;</b>{'No value'}
              </p>
              <p className="age">
                <b>Age&ensp;</b>{'No value'}
              </p>
              <p className="last-online">
                <b>Last online&ensp;</b>{timeDistance}
              </p>
              <p className="language">
                <b>Language&ensp;</b>{'No value'}
              </p>
              <p className="country">
                <b>Country&ensp;</b>{'No value'}
              </p>
              <p className="location">
                <b>Location&ensp;</b>{'No value'}
              </p>
              <p className="bio">
                <b>Intro&ensp;</b>{'No value'}
              </p>
              <div className="interest">
                <b>Interest&ensp;</b>
                <br/>
                <div className='interest-tag-wrapper'>
                  {'No value'}
                  {/* {interest.map(int => (<b className='interest-tag' key={int}>{int}</b>))} */}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  }
  
  export default ShowProfile;