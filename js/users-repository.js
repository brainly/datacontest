class UsersRepository {
    constructor(db) {
        this.db = db;
        this._listeners = {
            'user-added': [],
            'error': []
        };
        this.users = [];

        (this.db).child('users/').on('child_added', data => {
            let user = this._addUser(data.key, data.val());
            this._trigger('user-added', user);
        });
    }

    register(user) {
        let votesRef = (this.db).child(`users/${user.id}`);
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

        user = {
            id,
            name: user.name,
            avatar: user.avatar
        };

        this.users.push(user);

        return user;
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    onError(listener) {
        this._listeners['error'].push(listener);
    }

    onUserAdded(listener) {
        this._listeners['user-added'].push(listener);
    }
}

export default UsersRepository;
