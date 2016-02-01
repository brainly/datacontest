import User from './user.js';
import QuestionRepository from './question-repository.js';
import VotesRepository from './votes-repository.js';
import UsersRepository from './users-repository.js';
import changeBackgroundColor from './change-background-color.js';

const ref = new Firebase("https://datacontest.firebaseio.com");

const user = new User(ref);
let questionRepo = null;
let votesRepo = null;
let usersRepo = null;

const questionTemplate = document.querySelector('#question-template');
const answerTemplate = document.querySelector('#answer-template');
const avatarTemplate = document.querySelector('#avatar-template');
const $usersList = document.querySelector('.js-loggedin-users');

const $appElement = document.querySelector('.js-app');

if (user.isAuthenticated()) {
    startApp();
} else {
    user.onAuth(startApp);

    const $loginBtn = document.querySelector('.js-log-in');
    $loginBtn.addEventListener('click', user.authenticate.bind(user));
}

function startApp() {
    displayUserAvatar();
    changeSlide(1);

    questionRepo = new QuestionRepository(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(changeQuestion);
    questionRepo.onError(showError);

    votesRepo = new VotesRepository(ref, user.id);

    usersRepo = new UsersRepository(ref);
    usersRepo.register(user);

    usersRepo.onUserAdded(renderUser);
}

function initQuestions(questions) {
    questions.forEach(renderQuestion);
    initBindings();
}

function changeQuestion(questionIdx) {
    let startSlides = 2;
    changeSlide(startSlides + questionIdx);
}

function showError(error) {
    let message = error;

    if (typeof message === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}

function renderUser(user) {
    clearUserListOnFirstRender();
    let $avatarImage = avatarTemplate.content.querySelector('.js-avatar-image');
    $avatarImage.setAttribute('src', user.avatar);

    let $avatar = document.importNode(avatarTemplate.content, true);
    $usersList.appendChild($avatar);
}

function clearUserListOnFirstRender() {
    $usersList.innerHTML = '';
    clearUserListOnFirstRender = function() {};
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
    let $questionContent = questionTemplate.content.querySelector('.js-question-content');
    $questionContent.textContent = question.text;

    let $answersList = questionTemplate.content.querySelector('.js-answers-list');
    $answersList.innerHTML = '';
    question.answers.forEach((answer, index) => {
        $answersList.appendChild(renderAnswer(answer, index, questionId));
    });

    let $questionClone = document.importNode(questionTemplate.content, true);

    $appElement.insertBefore($questionClone, document.querySelector('.js-last-slide'));
}

function initBindings() {
    const $answerRadioButtons = Array.from(document.querySelectorAll('.js-answer-radio-button'));

    $answerRadioButtons.forEach(($radioButton) => {
        $radioButton.addEventListener('change', function () {
            const questionId = parseInt($radioButton.dataset.questionId, 10);
            const answerId = parseInt($radioButton.dataset.answerId, 10);

            votesRepo.vote(questionId, answerId);
        });
    });
}

function displayUserAvatar() {
    const $avatarImage = document.querySelector('.js-user-avatar-image');
    $avatarImage.src = user.avatar;
}

function changeSlide(slideIndex) {
    $appElement.style.left = -(slideIndex * 100) + 'vw';
    changeBackgroundColor(slideIndex);
}

//TODO remove - debug
window.changeSlide = changeSlide;
