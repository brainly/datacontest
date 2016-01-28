class UsersRepository {
    constructor(firebase, userId) {
        this.userId = userId;
        this.firebase = firebase;
        this._listeners = {
            'users-change': [],
            'error': []
        };
        this.users = [];

        (this.firebase).child('users/').once('value', data => {
            let users = data.val();

            for(let uid in users) {
                if(users.hasOwnProperty(uid)) {
                    this._addUser(uid, users[uid]);
                }
            }

            this._trigger('users-change');
        });

        (this.firebase).child('users/').on('child_added', data => {
            this._addUser(data.key(), data.val());
            this._trigger('users-change');
        });
    }

    register(user) {
        let votesRef = (this.firebase).child(`users/${user.id}`);
        votesRef.set({
            name: user.name,
            avatar: user.avatar
        });
    }

    getUserById(id) {
        let user = this.users.filter(user => user.id === id);
        return user.length ? user[0] : null;
    }

    _addUser(id, user) {
        if(this.getUserById(id)) {
            return;
        }

        this.users.push({
            id,
            name: user.name,
            avatar: user.avatar
        });
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    onError(listener) {
        this._listeners['error'].push(listener);
    }

    onUsersChange(listener) {
        this._listeners['users-change'].push(listener);
    }
}

export default UsersRepository;