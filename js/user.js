class User {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
            'auth': []
        };

        this._initUser = this._initUser.bind(this);
        this._checkIfAdmin = this._checkIfAdmin.bind(this);
        this._onUserReady = this._onUserReady.bind(this);

        const auth = this.firebase.auth();

        auth.onAuthStateChanged(user => 
            this._initUser(user)
                .then(this._checkIfAdmin)
                .then(this._onUserReady)
        );
    }

    isAdmin() {
        return this.admin;
    }

    isAuthenticated() {
        return this.name && this.email;
    }

    authenticate() {
        const auth = this.firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider);
    }

    onAuth(listener) {
        this._listeners['auth'].push(listener);
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    _initUser(data) {
        if (!data) {
            return;
        }

        const userData = data.providerData[0];

        this.id = userData.uid;
        this.name = userData.displayName;
        this.avatar = userData.photoURL;
        this.email = userData.email;

        if(userData) {
            ga('set', 'userId', this.id);
            ga('send', {
                hitType: 'event',
                eventCategory: 'App',
                eventAction: 'log in'
            });
        }

        return Promise.resolve();
    }

    _onUserReady() {
        console.log('_onUserReady');
        this._trigger('auth');
    }

    _checkIfAdmin() {
        console.log('_checkIfAdmin');
        return new Promise((resolve, reject) => {
            this.firebase.database().ref('admin-access').once('value', () => {
                this.admin = true;
                resolve();
            }, (err) => {
                if (err.code === 'PERMISSION_DENIED') {
                    this.admin = false;
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }
}

export default User;
