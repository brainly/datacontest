(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _questionRepository = require('./question-repository.js');

var _questionRepository2 = _interopRequireDefault(_questionRepository);

var _votesRepository = require('./votes-repository.js');

var _votesRepository2 = _interopRequireDefault(_votesRepository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = new Firebase("https://datacontest.firebaseio.com");
var user = new _user2.default(ref);
var questionRepo = null;
var votesRepo = null;

var $btn = document.querySelector('.js-log-in');
var $name = document.querySelector('.js-user-name');
var $avatar = document.querySelector('.js-user-avatar');
var $avatarImage = $avatar.querySelector('.js-user-avatar-image');

var $appElement = document.querySelector('.js-app');
var windowWidth = window.innerWidth;

if (user.isAuthenticated()) {
    startApp();
} else {
    $btn.addEventListener('click', function () {
        user.authenticate().then(startApp).catch(showError);
    });
}

window.addEventListener('resize', setSlidesWidth);

function startApp() {
    $name.innerHTML = user.name;
    $avatar.classList.remove('js-user-avatar-hidden');
    $avatarImage.src = user.avatar;

    questionRepo = new _questionRepository2.default(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(questionChanged);
    questionRepo.onError(showError);

    votesRepo = new _votesRepository2.default(ref, user.id);

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

function showError(error) {
    var message = error;

    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}

function renderAnswer(answer, answerId, questionId) {
    var $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
    var $answerButton = $answerTemplate.content.querySelector('.js-answer-radio-button');
    var $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
    var $answerGhostLabel = $answerTemplate.content.querySelector('.js-answer-ghost-label');
    var $answer = undefined;

    $answerContent.textContent = answer;
    $answerButton.dataset.answerId = answerId;
    $answerButton.dataset.questionId = questionId;

    $answerButton.setAttribute('id', 'answer-' + answerId);
    $answerGhostLabel.setAttribute('for', 'answer-' + answerId);
    $answerContent.setAttribute('for', 'answer-' + answerId);

    $answer = document.importNode($answerTemplate.content, true);

    return $answer;
}

function renderQuestion(question, questionId) {
    var $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
    var $question = $questionTemplate.content.querySelector('.js-question');
    var $questionContent = $questionTemplate.content.querySelector('.js-question-content');
    var $answersList = $questionTemplate.content.querySelector('.js-answers-list');
    var $questionClone = undefined;

    question.answers.forEach(function (answer, index) {
        $answersList.appendChild(renderAnswer(answer, index + 1, questionId + 1));
    });

    $questionContent.textContent = question.text;
    $question.setAttribute('id', 'question-' + questionId);
    $questionClone = document.importNode($questionTemplate.content, true);
    $appElement.appendChild($questionClone);

    $question = document.getElementById('question-' + questionId);
    initBindings($question);
}

function initBindings($question) {
    var $answerRadioButtons = Array.from($question.querySelectorAll('.js-answer-radio-button'));

    $answerRadioButtons.forEach(function ($radioButton) {
        $radioButton.addEventListener('change', function () {
            console.log('question', $radioButton.dataset.questionId);
            console.log('answerId', $radioButton.dataset.answerId);
        });
    });
}

function setSlidesWidth() {
    windowWidth = window.innerWidth;
    var $slides = Array.from(document.querySelectorAll('.js-slide'));

    $slides.forEach(function ($slide) {
        $slide.style.width = windowWidth + 'px';
    });
}

function changeSlide(slideIndex) {
    $appElement.style.left = -(slideIndex * windowWidth) + 'px';
}

setSlidesWidth();

window.changeSlide = changeSlide;

},{"./question-repository.js":2,"./user.js":3,"./votes-repository.js":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QuestionRepository = function () {
    function QuestionRepository(firebase) {
        var _this = this;

        _classCallCheck(this, QuestionRepository);

        this.firebase = firebase;
        this.questions = null;
        this.currentQuestion = null;

        this._listeners = {
            'ready': [],
            'question-change': [],
            'error': []
        };

        var questionsRef = this.firebase.child('/questions');
        var currentQuestionRef = this.firebase.child('/current-question');

        questionsRef.once("value", function (snapshot) {
            _this.questions = snapshot.val();
            _this._trigger('ready', _this.questions);
        }, this._trigger.bind(this, 'error'));

        currentQuestionRef.on("value", function (snapshot) {
            _this.currentQuestion = snapshot.val();
            _this._trigger('question-change', _this.currentQuestion);
        }, this._trigger.bind(this, 'error'));
    }

    _createClass(QuestionRepository, [{
        key: '_trigger',
        value: function _trigger(action, data) {
            this._listeners[action].forEach(function (callback) {
                callback(data);
            });
        }
    }, {
        key: 'onError',
        value: function onError(listener) {
            this._listeners['error'].push(listener);
        }
    }, {
        key: 'onReady',
        value: function onReady(listener) {
            this._listeners['ready'].push(listener);
        }
    }, {
        key: 'onQuestionChange',
        value: function onQuestionChange(listener) {
            this._listeners['question-change'].push(listener);
        }
    }]);

    return QuestionRepository;
}();

exports.default = QuestionRepository;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(firebase) {
        _classCallCheck(this, User);

        this.firebase = firebase;

        //check if logged in
        var authData = this.firebase.getAuth();
        if (authData) {
            this._initUser(authData);
        }
    }

    _createClass(User, [{
        key: "isAuthenticated",
        value: function isAuthenticated() {
            return this.name && this.email;
        }
    }, {
        key: "authenticate",
        value: function authenticate() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                _this.firebase.authWithOAuthRedirect("google", function (error, authData) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    _this._initUser(authData);

                    resolve();
                }, {
                    remember: "sessionOnly",
                    scope: "email"
                });
            });
        }
    }, {
        key: "_initUser",
        value: function _initUser(authData) {
            //TODO add "@brainly.com" check

            this.id = authData.uid;
            this.name = authData.google.displayName;
            this.avatar = authData.google.profileImageURL;
            this.email = authData.google.email;
        }
    }]);

    return User;
}();

exports.default = User;

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VoteRepository = function () {
    function VoteRepository(firebase, userId) {
        _classCallCheck(this, VoteRepository);

        this.userId = userId;
        this.firebase = firebase;
        this._listeners = {
            'votes-change': [],
            'error': []
        };

        //(this.firebase).child('votes/').on('child_added', (data) => {
        //    console.log('child_added', data);
        //});
    }

    _createClass(VoteRepository, [{
        key: 'vote',
        value: function vote(questionId, answerId) {
            var votesRef = this.firebase.child('votes/' + questionId + '/' + this.userId);
            votesRef.set(answerId);
        }
    }, {
        key: '_trigger',
        value: function _trigger(action, data) {
            this._listeners[action].forEach(function (callback) {
                callback(data);
            });
        }
    }, {
        key: 'onError',
        value: function onError(listener) {
            this._listeners['error'].push(listener);
        }
    }, {
        key: 'onVotesChange',
        value: function onVotesChange(listener) {
            this._listeners['votes-change'].push(listener);
        }
    }]);

    return VoteRepository;
}();

exports.default = VoteRepository;

},{}]},{},[1])


//# sourceMappingURL=build.js.map
