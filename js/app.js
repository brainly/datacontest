import User from './user.js';
import QuestionRepository from './question-repository.js';
import VotesRepository from './votes-repository.js';

const ref = new Firebase("https://datacontest.firebaseio.com");
const user = new User(ref);
let questionRepo = null;

const $btn = document.querySelector('.js-log-in');
const $name = document.querySelector('.js-user-name');
const $avatar = document.querySelector('.js-user-avatar');

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
    $avatar.src = user.avatar;

    questionRepo = new QuestionRepository(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(questionChanged);
    questionRepo.onError(showError);
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

function showError(error) {
    let message = error;

    if(typeof message === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}


function renderAnswer(answer) {
    let $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
    let $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
    let $answerClone;

    $answerContent.textContent = answer;
    $answerClone = document.importNode($answerTemplate.content, true);

    return $answerClone;
}

function renderQuestion(question) {
    let $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
    let $questionContent = $questionTemplate.content.querySelector('.js-question-content');
    let $answersList = $questionTemplate.content.querySelector('.js-answers-list');
    let $questionClone;

    question.answers.forEach((answer) => {
        $answersList.appendChild(renderAnswer(answer));
    });

    $questionContent.textContent = question.text;
    $questionClone = document.importNode($questionTemplate.content, true);
    $appElement.appendChild($questionClone);

}

function setSlidesWidth() {
    windowWidth = window.innerWidth;
    const $slides = Array.from(document.querySelectorAll('.js-slide'));

    $slides.forEach(function($slide) {
        $slide.style.width = windowWidth + 'px';
    });
}

function changeSlide(slideIndex) {
    $appElement.style.left = - (slideIndex * windowWidth) + 'px';
}

setSlidesWidth();

window.changeSlide = changeSlide;
