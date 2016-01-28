import User from './user.js';
import QuestionRepository from './question-repository.js';

const ref = new Firebase("https://datacontest.firebaseio.com");
const user = new User(ref);
let questionRepo = null;

const $btn = document.getElementById('js-log-in');
const $name = document.getElementById('js-user-name');
const $avatar = document.getElementById('js-user-avatar');
const $email = document.getElementById('js-user-email');
const $questions = document.getElementById('js-questions');

$btn.addEventListener('click', () => {
    user.authenticate().then(() => {
        $name.innerHTML = user.name;
        $email.innerHTML = user.email;
        $avatar.src = user.avatar;

        questionRepo = new QuestionRepository(ref);

        questionRepo.onReady(questions => {
            questions.forEach((question, idx) => {
                let li = document.createElement('li');
                li.innerHTML = question.text;

                $questions.appendChild(li);
            });
        });

        questionRepo.onQuestionChange(questionIdx => {
            console.log('qchange', questionIdx);
            if(questionIdx === -1) {
                return;
            }

            if(questionIdx - 1 >= 0) {
                $questions.childNodes[questionIdx - 1].style.fontWeight = 'normal';
            }

            $questions.childNodes[questionIdx].style.fontWeight = 'bold';
        });
    }).catch((error) => {
        alert(error);
    });
});