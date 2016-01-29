import React from 'react';
import Users from '../components/users.js';

const Welcome = React.createClass({
    getInitialState() {
        return {
            users: []
        }
    },

    componentWillMount() {
        this.user = this.props.user;
        this.usersRepo = this.props.usersRepo;
        this.usersRepo.onUserAdded(this.addUser);
    },

    addUser() {
        this.setState({
            users: this.usersRepo.users
        });
    },

    render() {
        return (
            <div className="app-contest__slide">
                <div className="app-contest__header">
                    <h1 className="mint-header-primary">
                        You made it!
                    </h1>
                </div>

                <div className="app-contest__content">
                    <div className="mint-avatar mint-avatar--xlarge">
                        <img className="mint-avatar__image" src={this.user.avatar}/>
                    </div>
                </div>

                <div>
                    <p className="mint-text">Who's else is in?</p>
                    <Users users={this.state.users} />
                </div>
            </div>
        )
    }
});

export default Welcome;
