import User from './user.js';

const ref = new Firebase("https://datacontest.firebaseio.com");
const user = new User(ref);

const $btn = document.getElementById('js-log-in');
const $name = document.getElementById('js-user-name');
const $avatar = document.getElementById('js-user-avatar');
const $email = document.getElementById('js-user-email');

$btn.addEventListener('click', () => {
    user.authenticate().then(() => {
        $name.innerHTML = user.name;
        $email.innerHTML = user.email;
        $avatar.src = user.avatar;
    }).catch((error) => {
        alert(error);
    });
});