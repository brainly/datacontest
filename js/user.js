class User {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
            'auth': []
        };

        (this.firebase).onAuth((authData) => {
            this._initUser(authData).then(() => {
                this._trigger('auth');

                if(authData) {
                    ga('set', 'userId', this.id);
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'App',
                        eventAction: 'log in'
                    });
                }
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
        (this.firebase).authWithOAuthRedirect('google', (error, authData) => {
            if (error) {
                this._trigger('error', error);
            } else {
                //this will never happen since on success user is redirected to the oauth page
            }
        }, {
            remember: 'sessionOnly',
            scope: 'email'
        });
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

        this.id = authData ? authData.uid : null;
        this.name = authData ? authData.google.displayName : null;
        this.avatar = authData ? authData.google.profileImageURL : null;
        this.email = authData ? authData.google.email : null;

        return this._checkIfAdmin();
    }

    _checkIfAdmin() {
        //we are trying to determine if user has admin rights by accessing admin-only data
        return new Promise((resolve, reject) => {
            (this.firebase).child('admin-access').once('value', () => {
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
