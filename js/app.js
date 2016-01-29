import User from './user.js';
import QuestionRepository from './question-repository.js';
import VotesRepository from './votes-repository.js';
import UsersRepository from './users-repository.js';

const ref = new Firebase("https://datacontest.firebaseio.com");

const user = new User(ref);
let questionRepo = null;
let votesRepo = null;
let usersRepo = null;

const questionTemplate = document.querySelector('#question-template');
const answerTemplate = document.querySelector('#answer-template');
const avatarTemplate = document.querySelector('#avatar-template');

const $appElement = document.querySelector('.js-app');

if (user.isAuthenticated()) {
    startApp();
} else {
    user.onAuth(startApp);

    const $loginBtn = document.querySelector('.js-log-in');
    $loginBtn.addEventListener('click', user.authenticate);
}

function startApp() {
    const $avatarImage = document.querySelector('.js-user-avatar-image');
    $avatarImage.src = user.avatar;

    changeSlide(1);

    questionRepo = new QuestionRepository(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(questionChanged);
    questionRepo.onError(showError);

    votesRepo = new VotesRepository(ref, user.id);

    usersRepo = new UsersRepository(ref);
    usersRepo.register(user);

    usersRepo.onUserAdded(user => {
        let $usersList = document.querySelector('.js-loggedin-users');

        let $avatarImage = avatarTemplate.content.querySelector('.js-avatar-image');
        $avatarImage.setAttribute('src', user.avatar);

        let $avatar = document.importNode(avatarTemplate.content, true);
        $usersList.appendChild($avatar);
    });
}

function initQuestions(questions) {
    questions.forEach(renderQuestion);
}

function questionChanged(questionIdx) {
    let startSlides = 2;
    changeSlide(startSlides + questionIdx);
}

function changeBackground(questionIdx) {
    const colors = [
        '#6ed6a0',
        '#5bb8ff',
        '#ff8073',
        '#ffbe32'
    ];

    const rand = Math.floor(Math.random() * colors.length);

    if (questionIdx != 0) {
        document.body.style.backgroundColor = colors[rand];
    } else {
        document.body.style.backgroundColor = '';
    }
}

function showError(error) {
    let message = error;

    if (typeof message === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}

function renderAnswer(answer, answerId, questionId) {
    let $answerButton = answerTemplate.content.querySelector('.js-answer-radio-button');
    $answerButton.dataset.answerId = answerId;
    $answerButton.dataset.questionId = questionId;
    $answerButton.setAttribute('id', 'answer-' + questionId + '-' + answerId);

    let $answerContent = answerTemplate.content.querySelector('.js-answer-content');
    $answerContent.textContent = answer;
    $answerContent.setAttribute('for', 'answer-' + questionId + '-' + answerId);

    let $answerGhostLabel = answerTemplate.content.querySelector('.js-answer-ghost-label');
    $answerGhostLabel.setAttribute('for', 'answer-' + questionId + '-' + answerId);

    return document.importNode(answerTemplate.content, true);
}

function renderQuestion(question, questionId) {
    let $question = questionTemplate.content.querySelector('.js-question');
    $question.setAttribute('id', 'question-' + questionId);

    let $questionContent = questionTemplate.content.querySelector('.js-question-content');
    $questionContent.textContent = question.text;

    let $answersList = questionTemplate.content.querySelector('.js-answers-list');
    $answersList.innerHTML = '';
    question.answers.forEach((answer, index) => {
        $answersList.appendChild(renderAnswer(answer, index, questionId));
    });

    let $questionClone = document.importNode(questionTemplate.content, true);

    $appElement.insertBefore($questionClone, document.querySelector('.js-last-slide'));
    $question = document.getElementById('question-' + questionId);

    initBindings($question);
}

function initBindings($question) {
    let $answerRadioButtons = Array.from($question.querySelectorAll('.js-answer-radio-button'));

    $answerRadioButtons.forEach(($radioButton) => {
        $radioButton.addEventListener('change', function () {
            let questionId = parseInt($radioButton.dataset.questionId, 10);
            let answerId = parseInt($radioButton.dataset.answerId, 10);

            votesRepo.vote(questionId, answerId);
        });
    });
}

function changeSlide(slideIndex) {
    $appElement.style.left = -(slideIndex * 100) + 'vw';
    changeBackground(slideIndex);
}

//TODO remove - debug
window.changeSlide = changeSlide;