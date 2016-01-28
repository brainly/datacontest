(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _questionRepository = require('./question-repository.js');

var _questionRepository2 = _interopRequireDefault(_questionRepository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = new Firebase("https://datacontest.firebaseio.com");
var user = new _user2.default(ref);
var questionRepo = null;

var $btn = document.querySelector('.js-log-in');
var $name = document.querySelector('.js-user-name');
var $avatar = document.querySelector('.js-user-avatar');

var $appElement = document.querySelector('.js-app');
var windowWidth = window.innerWidth;

$btn.addEventListener('click', function () {
    user.authenticate().then(startApp).catch(showError);
});

window.addEventListener('resize', setSlidesWidth);

function startApp() {
    $name.innerHTML = user.name;
    $avatar.src = user.avatar;

    questionRepo = new _questionRepository2.default(ref);
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
    var message = error;

    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}

function renderAnswer(answer) {
    var $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
    var $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
    var $answerClone = undefined;

    $answerContent.textContent = answer;
    $answerClone = document.importNode($answerTemplate.content, true);

    return $answerClone;
}

function renderQuestion(question) {
    var $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
    var $questionContent = $questionTemplate.content.querySelector('.js-question-content');
    var $answersList = $questionTemplate.content.querySelector('.js-answers-list');
    var $questionClone = undefined;

    question.answers.forEach(function (answer) {
        $answersList.appendChild(renderAnswer(answer));
    });

    $questionContent.textContent = question.text;
    $questionClone = document.importNode($questionTemplate.content, true);
    $appElement.appendChild($questionClone);
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

},{"./question-repository.js":2,"./user.js":3}],2:[function(require,module,exports){
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

        this.name = null;
        this.avatar = null;
        this.email = null;
    }

    _createClass(User, [{
        key: "authenticate",
        value: function authenticate() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.firebase.authWithOAuthPopup("google", function (error, authData) {
                    if (error) {
                        reject(error);
                        return;
                    }

                    //TODO add "@brainly.com" check

                    _this.name = authData.google.displayName;
                    _this.avatar = authData.google.profileImageURL;
                    _this.email = authData.google.email;

                    resolve();
                }, {
                    remember: "sessionOnly",
                    scope: "email"
                });
            });
        }
    }]);

    return User;
}();

exports.default = User;

},{}]},{},[1])


//# sourceMappingURL=build.js.map
