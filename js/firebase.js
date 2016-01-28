var ref = new Firebase("https://datacontest.firebaseio.com");

ref.authWithOAuthPopup("google", function(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);

        let name = authData.google.displayName;
        let img = authData.google.profileImageURL;
        let email = authData.google.email;

        document.body.innerHTML = `Hello ${name}! <br/>That's your face: <img src='${img}' style="height:50px" /> and that's your email: ${email}.`;
    }
}, {
    remember: "sessionOnly",
    scope: "email"
});