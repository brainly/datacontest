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
                .catch(e => console.log(e))
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
            return Promise.reject();
        }

        const providerData = data.providerData[0];

        this.id = data.uid;
        this.name = providerData.displayName;
        this.avatar = providerData.photoURL;
        this.email = providerData.email;

        if(providerData) {
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
        this._trigger('auth');
    }

    _checkIfAdmin() {
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
