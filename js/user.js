class User {
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
        this._listeners = {
            'auth': []
        };

        (this.auth).getRedirectResult().catch(error => {
            this._trigger('error', error);
        });

        (this.auth).onAuthStateChanged(user => {
            this._initUser(user).then(() => {
                this._trigger('auth');
            });
        });
    }

    isAdmin() {
        return this.admin;
    }

    isAuthenticated() {
        return this.name && this.email;
    }

    authenticate() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');

        this.auth.signInWithRedirect(provider).catch(error => {
            this._trigger('error', error);
        })
    }

    onAuth(listener) {
        this._listeners['auth'].push(listener);
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    _initUser(authData) {
        //TODO add '@brainly.com' check
        if(authData) {
            this.id = authData.uid || authData.providerData[0].uid || null;
            this.name = authData.displayName || authData.providerData[0].displayName || null;
            this.avatar = authData.photoURL || authData.providerData[0].photoURL || null;
            this.email = authData.email || authData.providerData[0].email || null;
        } else {
            this.id = null;
            this.name = null;
            this.avatar = null;
            this.email = null;
        }

        return this._checkIfAdmin();
    }

    _checkIfAdmin() {
        //we are trying to determine if user has admin rights by accessing admin-only data
        return new Promise((resolve, reject) => {
            (this.db).child('admin-access').once('value', () => {
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
