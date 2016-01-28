import User from './user.js';
import QuestionRepository from './question-repository.js';
import VotesRepository from './votes-repository.js';
import UsersRepository from './users-repository.js';

const ref = new Firebase("https://datacontest.firebaseio.com");
const user = new User(ref);
let questionRepo = null;
let votesRepo = null;
let usersRepo = null;

const $btn = document.querySelector('.js-log-in');
const $name = document.querySelector('.js-user-name');
const $avatar = document.querySelector('.js-user-avatar');
const $avatarImage = $avatar.querySelector('.js-user-avatar-image');

const $appElement = document.querySelector('.js-app');
let windowWidth = window.innerWidth;

if(user.isAuthenticated()) {
    startApp();
} else {
    $btn.addEventListener('click', () => {
        user.authenticate()
            .then(startApp)
            .catch(showError);
    });
}

window.addEventListener('resize', setSlidesWidth);

function startApp() {
    $name.innerHTML = user.name;
    $avatar.classList.remove('js-user-avatar-hidden');
    $avatarImage.src = user.avatar;

    questionRepo = new QuestionRepository(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(questionChanged);
    questionRepo.onError(showError);

    votesRepo = new VotesRepository(ref, user.id);

    usersRepo = new UsersRepository(ref);
    usersRepo.register(user);

    usersRepo.onUsersChange(() => {
        let usersList = document.querySelector('.js-loggedin-users');
        usersList.innerHTML = '';

        Array.from(usersRepo.users).forEach(user => {
            let img = document.createElement('img');
            img.src = user.avatar;

            //TODO fixme - move to CSS
            img.style.maxWidth = '30px';
            img.style.maxHeight = '30px';

            usersList.appendChild(img);
        })
    });

    window.votesRepo = votesRepo;
    $btn.style.display = 'none';
}

function initQuestions(questions) {
    questions.forEach(renderQuestion);
    setSlidesWidth();
}

function questionChanged(questionIdx) {
    console.log('qchange', questionIdx);
    changeSlide(questionIdx + 1);
}

function changeBackground(questionIdx) {
    const colors = [
        '#6ed6a0',
        '#5bb8ff',
        '#ff8073',
        '#ffbe32',
    ];

    const rand = Math.floor(Math.random() * colors.length);

    if (questionIdx != 0) {
        document.body.style.backgroundColor = colors[rand];
    }
}

function showError(error) {
    let message = error;

    if(typeof message === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}


function renderAnswer(answer, answerId, questionId) {
    let $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
    let $answerButton =  $answerTemplate.content.querySelector('.js-answer-radio-button');
    let $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
    let $answerGhostLabel = $answerTemplate.content.querySelector('.js-answer-ghost-label');
    let $answer;


    $answerContent.textContent = answer;
    $answerButton.dataset.answerId = answerId;
    $answerButton.dataset.questionId = questionId;

    $answerButton.setAttribute('id', 'answer-' + questionId + '-' + answerId);
    $answerGhostLabel.setAttribute('for', 'answer-' + questionId + '-' + answerId);
    $answerContent.setAttribute('for', 'answer-' + questionId + '-' + answerId);

    $answer = document.importNode($answerTemplate.content, true);

    return $answer;
}

function renderQuestion(question, questionId) {
    let $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
    let $question = $questionTemplate.content.querySelector('.js-question');
    let $questionContent = $questionTemplate.content.querySelector('.js-question-content');
    let $answersList = $questionTemplate.content.querySelector('.js-answers-list');
    let $questionClone;

    question.answers.forEach((answer, index) => {
        $answersList.appendChild(renderAnswer(answer, index, questionId));
    });

    $questionContent.textContent = question.text;
    $question.setAttribute('id', 'question-' + questionId);
    $questionClone = document.importNode($questionTemplate.content, true);
    $appElement.appendChild($questionClone);


    $question = document.getElementById('question-' + questionId);
    initBindings($question);
}

function initBindings($question) {
    let $answerRadioButtons = Array.from($question.querySelectorAll('.js-answer-radio-button'));

    $answerRadioButtons.forEach(($radioButton) => {
        $radioButton.addEventListener('change', function() {
            let questionId = parseInt($radioButton.dataset.questionId, 10);
            let answerId = parseInt($radioButton.dataset.answerId, 10);

            votesRepo.vote(questionId, answerId);
        });
    });
}

function setSlidesWidth() {
    windowWidth = window.innerWidth;
    const $slides = Array.from(document.querySelectorAll('.js-slide'));
    $slides.forEach(function($slide) {
        $slide.style.width = windowWidth + 'px';
    });
}

function changeSlide(slideIndex) {
    windowWidth = window.innerWidth;
    $appElement.style.left = - (slideIndex * windowWidth) + 'px';
    changeBackground(slideIndex);
}

setSlidesWidth();

window.changeSlide = changeSlide;
