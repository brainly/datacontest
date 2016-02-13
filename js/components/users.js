import React from 'react';
import UserAvatar from '../components/userAvatar';

const Users = (props) => {
    const userList = props.users.map((user, index) => {
        return (
            <UserAvatar user={user} key={index} />
        );
    });

    return (
        <div>
            {userList}
        </div>
    )
};

export default Users;
