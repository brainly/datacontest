import React from 'react';
import UserAvatar from '../components/userAvatar';


class Users extends React.Component {
    render() {
        const userList = this.props.users.map((user, index) => {
            return (
                <UserAvatar user={user} key={index} />
            );
        });

        return (
            <div>
                {userList}
            </div>
        )
    }
}

export default Users;
