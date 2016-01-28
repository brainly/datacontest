class User {
    constructor(firebase) {
        this.firebase = firebase;

        //check if logged in
        let authData = (this.firebase).getAuth();
        if (authData) {
            this._initUser(authData);
        }
    }

    isAuthenticated() {
        return this.name && this.email;
    }

    authenticate() {
        return new Promise((resolve, reject) => {

            (this.firebase).authWithOAuthRedirect("google", (error, authData) => {
                if (error) {
                    reject(error);
                    return;
                }

                this._initUser(authData);

                resolve();
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        });
    }

    _initUser(authData) {
        //TODO add "@brainly.com" check

        this.id = authData.uid;
        this.name = authData.google.displayName;
        this.avatar = authData.google.profileImageURL;
        this.email = authData.google.email;
    }
}

export default User;