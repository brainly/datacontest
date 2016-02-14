import React from 'react';
import Users from '../components/users.js';

const Welcome = (props) => {
    return (
        <div className="app-contest__slide">
            <div className="app-contest__header">
                <h1 className="mint-header-primary">
                    You made it!
                </h1>
            </div>

            <div className="app-contest__content">
                <div className="mint-avatar mint-avatar--xlarge">
                    <img className="mint-avatar__image" src={props.user.avatar}/>
                </div>
            </div>

            <div>
                <p className="mint-text">Who's else is in?</p>
                <Users users={props.users} />
            </div>
        </div>
    )
};

export default Welcome;
