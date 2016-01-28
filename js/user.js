class User {
    constructor(firebase) {
        this.firebase = firebase;

        this.name = null;
        this.avatar = null;
        this.email = null;
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            (this.firebase).authWithOAuthPopup("google", (error, authData) => {
                if (error) {
                    reject(error);
                    return;
                }

                //TODO add "@brainly.com" check

                this.name = authData.google.displayName;
                this.avatar = authData.google.profileImageURL;
                this.email = authData.google.email;

                resolve();
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        });
    }
}

export default User;