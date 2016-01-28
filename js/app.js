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

            let $avatarTemplate = document.importNode(document.querySelector('#avatar-template'), true);
            let $avatarImage = $avatarTemplate.content.querySelector('.js-avatar-image');
            let $avatarClone;

            $avatarImage.setAttribute('src', user.avatar);
            $avatarClone = document.importNode($avatarTemplate.content, true);
            usersList.appendChild($avatarClone);
        })
    });

    window.votesRepo = votesRepo;
    $btn.style.display = 'none';
}

function initQuestions(questions) {
    questions.forEach(renderQuestion);

    questions.forEach((question, idx) => {
        votesRepo.onVotesChange(idx, votes => {
            console.log(idx, votes);
            clearAvatars(idx);

            for(let uid in votes) {
                if(!votes.hasOwnProperty(uid)) {
                    return;
                }

                let user = usersRepo.getUserById(uid);
                let vote = votes[uid];

                addAvatar({
                    questionId: idx,
                    user: user,
                    vote: vote
                });
            }
        });
    });
    setSlidesWidth();
}

function clearAvatars(questionId) {
    let $input = document.getElementById(`answer-${questionId}-0`);
    let $answer = $input.parentNode.parentNode.parentNode.parentNode.parentNode;
    let $answerersAll = $answer.querySelectorAll('.js-answerers');

    Array.from($answerersAll).forEach($answerers => {
        $answerers.innerHTML = '';
    })
}

function addAvatar({questionId, user, vote}) {
    let $input = document.getElementById(`answer-${questionId}-${vote}`);
    let $answer = $input.parentNode.parentNode.parentNode;
    let $answerers = $answer.querySelector('.js-answerers');

    let $avatar = document.createElement('img');
    $avatar.src = user.avatar;

    //TODO fixme
    $avatar.style.maxHeight = '20px';
    $avatar.style.maxWidth = '20px';

    $answerers.appendChild($avatar);
}

function questionChanged(questionIdx) {
    changeSlide(questionIdx + 1);
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
    //$appElement.appendChild($questionClone);
    $appElement.insertBefore($questionClone, document.querySelector('.js-last-slide'));


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
