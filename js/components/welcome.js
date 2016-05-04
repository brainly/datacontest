import React from 'react';
import Users from '../components/users.js';

const Welcome = (props) => {
    const filterMe = users => users.filter(u => u.id !== props.user.id);
    const numberOfPeople = num => num > 1 ? 'There are ' + num + ' of us!' : 'You are all alone here. Wait for the others!';

    return (
        <div className="app-contest__slide">
            <div className="app-contest__header">
                <h1 className="mint-header-primary">
                    You made it!
                </h1>
            </div>

            <div className="app-contest__content">
                <div className="mint-avatar mint-avatar--xxlarge">
                    <img className="mint-avatar__image" src={props.user.avatar}/>
                </div>
            </div>

            <div>
                <p className="mint-text">Who else is in?</p>
                <Users users={filterMe(props.users)} />
                <span>{numberOfPeople(props.users.length)}</span>
            </div>
        </div>
    )
};

export default Welcome;
