import User from './user.js';
import QuestionRepository from './question-repository.js';

const ref = new Firebase("https://datacontest.firebaseio.com");
const user = new User(ref);
let questionRepo = null;

const $btn = document.querySelector('.js-log-in');
const $name = document.querySelector('.js-user-name');
const $avatar = document.querySelector('.js-user-avatar');
const $avatarImage = $avatar.querySelector('.js-user-avatar-image');

const $appElement = document.querySelector('.js-app');
let windowWidth = window.innerWidth;

$btn.addEventListener('click', () => {
    user.authenticate()
        .then(startApp)
        .catch(showError);
});

window.addEventListener('resize', setSlidesWidth);

function startApp() {
    $name.innerHTML = user.name;
    $avatar.classList.remove('js-user-avatar-hidden');
    $avatarImage.src = user.avatar;

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


function renderAnswer(answer, answerId, questionId) {
    let $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
    let $answerButton =  $answerTemplate.content.querySelector('.js-answer-radio-button');
    let $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
    let $answer;

    $answerContent.textContent = answer;
    $answerButton.dataset.answerId = answerId;
    $answerButton.dataset.questionId = questionId;

    $answer = document.importNode($answerTemplate.content, true);

    return $answer;
}

function renderQuestion(question, questionId) {
    let $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
    let $questionContent = $questionTemplate.content.querySelector('.js-question-content');
    let $answersList = $questionTemplate.content.querySelector('.js-answers-list');
    let $question;
    let $answerRadioButtons;

    question.answers.forEach((answer, index) => {
        $answersList.appendChild(renderAnswer(answer, index + 1, questionId));
    });

    $answerRadioButtons = Array.from($answersList.querySelectorAll('.js-answer-radio-button'));


    $answerRadioButtons.foreach(($radioButton) => {
        $radioButton.addEventListener('change', function() {
            console.log('klikłem');
        });
    });


    $questionContent.textContent = question.text;
    $question = document.importNode($questionTemplate.content, true);
    $appElement.appendChild($question);

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
