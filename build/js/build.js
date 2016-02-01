(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _questionRepository = require('./question-repository.js');

var _questionRepository2 = _interopRequireDefault(_questionRepository);

var _votesRepository = require('./votes-repository.js');

var _votesRepository2 = _interopRequireDefault(_votesRepository);

var _usersRepository = require('./users-repository.js');

var _usersRepository2 = _interopRequireDefault(_usersRepository);

var _changeBackgroundColor = require('./change-background-color.js');

var _changeBackgroundColor2 = _interopRequireDefault(_changeBackgroundColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = new Firebase("https://datacontest.firebaseio.com");

var user = new _user2.default(ref);
var questionRepo = null;
var votesRepo = null;
var usersRepo = null;

var questionTemplate = document.querySelector('#question-template');
var answerTemplate = document.querySelector('#answer-template');
var avatarTemplate = document.querySelector('#avatar-template');
var $usersList = document.querySelector('.js-loggedin-users');

var $appElement = document.querySelector('.js-app');

if (user.isAuthenticated()) {
    startApp();
} else {
    user.onAuth(startApp);

    var $loginBtn = document.querySelector('.js-log-in');
    $loginBtn.addEventListener('click', user.authenticate.bind(user));
}

function startApp() {
    displayUserAvatar();
    changeSlide(1);

    questionRepo = new _questionRepository2.default(ref);
    questionRepo.onReady(initQuestions);
    questionRepo.onQuestionChange(changeQuestion);
    questionRepo.onError(showError);

    votesRepo = new _votesRepository2.default(ref, user.id);

    usersRepo = new _usersRepository2.default(ref);
    usersRepo.register(user);

    usersRepo.onUserAdded(renderUser);
}

function initQuestions(questions) {
    questions.forEach(renderQuestion);
    initBindings();
}

function changeQuestion(questionIdx) {
    var startSlides = 2;
    changeSlide(startSlides + questionIdx);
}

function showError(error) {
    var message = error;

    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
        message = message.code;
    }

    console.error('error', error);
    alert(message);
}

function renderUser(user) {
    clearUserListOnFirstRender();
    var $avatarImage = avatarTemplate.content.querySelector('.js-avatar-image');
    $avatarImage.setAttribute('src', user.avatar);

    var $avatar = document.importNode(avatarTemplate.content, true);
    $usersList.appendChild($avatar);
}

function clearUserListOnFirstRender() {
    $usersList.innerHTML = '';
    clearUserListOnFirstRender = function clearUserListOnFirstRender() {};
}

function renderAnswer(answer, answerId, questionId) {
    var $answerButton = answerTemplate.content.querySelector('.js-answer-radio-button');
    $answerButton.dataset.answerId = answerId;
    $answerButton.dataset.questionId = questionId;
    $answerButton.setAttribute('id', 'answer-' + questionId + '-' + answerId);

    var $answerContent = answerTemplate.content.querySelector('.js-answer-content');
    $answerContent.textContent = answer;
    $answerContent.setAttribute('for', 'answer-' + questionId + '-' + answerId);

    var $answerGhostLabel = answerTemplate.content.querySelector('.js-answer-ghost-label');
    $answerGhostLabel.setAttribute('for', 'answer-' + questionId + '-' + answerId);

    return document.importNode(answerTemplate.content, true);
}

function renderQuestion(question, questionId) {
    var $questionContent = questionTemplate.content.querySelector('.js-question-content');
    $questionContent.textContent = question.text;

    var $answersList = questionTemplate.content.querySelector('.js-answers-list');
    $answersList.innerHTML = '';
    question.answers.forEach(function (answer, index) {
        $answersList.appendChild(renderAnswer(answer, index, questionId));
    });

    var $questionClone = document.importNode(questionTemplate.content, true);

    $appElement.insertBefore($questionClone, document.querySelector('.js-last-slide'));
}

function initBindings() {
    var $answerRadioButtons = Array.from(document.querySelectorAll('.js-answer-radio-button'));

    $answerRadioButtons.forEach(function ($radioButton) {
        $radioButton.addEventListener('change', function () {
            var questionId = parseInt($radioButton.dataset.questionId, 10);
            var answerId = parseInt($radioButton.dataset.answerId, 10);

            votesRepo.vote(questionId, answerId);
        });
    });
}

function displayUserAvatar() {
    var $avatarImage = document.querySelector('.js-user-avatar-image');
    $avatarImage.src = user.avatar;
}

function changeSlide(slideIndex) {
    $appElement.style.left = -(slideIndex * 100) + 'vw';
    (0, _changeBackgroundColor2.default)(slideIndex);
}

//TODO remove - debug
window.changeSlide = changeSlide;

},{"./change-background-color.js":2,"./question-repository.js":3,"./user.js":4,"./users-repository.js":5,"./votes-repository.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = changeBackgroundColor;
function changeBackgroundColor(index) {
    var colors = ['#6ed6a0', '#5bb8ff', '#ff8073', '#ffbe32'];

    var rand = Math.floor(Math.random() * colors.length);

    if (index != 0) {
        document.body.style.backgroundColor = colors[rand];
    } else {
        document.body.style.backgroundColor = '';
    }
}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(firebase) {
        var _this = this;

        _classCallCheck(this, User);

        this.firebase = firebase;
        this._listeners = {
            'auth': []
        };

        this.firebase.onAuth(function (authData) {
            _this._initUser(authData);
            _this._trigger('auth');
        });
    }

    _createClass(User, [{
        key: 'isAuthenticated',
        value: function isAuthenticated() {
            return this.name && this.email;
        }
    }, {
        key: 'authenticate',
        value: function authenticate() {
            var _this2 = this;

            this.firebase.authWithOAuthRedirect("google", function (error, authData) {
                if (error) {
                    _this2._trigger('error', error);
                } else {
                    //this will never happen since on success user is redirected to the oauth page
                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        }
    }, {
        key: 'onAuth',
        value: function onAuth(listener) {
            this._listeners['auth'].push(listener);
        }
    }, {
        key: '_trigger',
        value: function _trigger(action, data) {
            this._listeners[action].forEach(function (callback) {
                callback(data);
            });
        }
    }, {
        key: '_initUser',
        value: function _initUser(authData) {
            //TODO add "@brainly.com" check

            this.id = authData ? authData.uid : null;
            this.name = authData ? authData.google.displayName : null;
            this.avatar = authData ? authData.google.profileImageURL : null;
            this.email = authData ? authData.google.email : null;
        }
    }]);

    return User;
}();

exports.default = User;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UsersRepository = function () {
    function UsersRepository(firebase, userId) {
        var _this = this;

        _classCallCheck(this, UsersRepository);

        this.userId = userId;
        this.firebase = firebase;
        this._listeners = {
            'user-added': [],
            'error': []
        };
        this.users = [];

        this.firebase.child('users/').on('child_added', function (data) {
            var user = _this._addUser(data.key(), data.val());
            _this._trigger('user-added', user);
        });
    }

    _createClass(UsersRepository, [{
        key: 'register',
        value: function register(user) {
            var votesRef = this.firebase.child('users/' + user.id);
            votesRef.set({
                name: user.name,
                avatar: user.avatar
            });
        }
    }, {
        key: 'getUserById',
        value: function getUserById(id) {
            var user = this.users.filter(function (user) {
                return user.id === id;
            });
            return user.length ? user[0] : null;
        }
    }, {
        key: '_addUser',
        value: function _addUser(id, user) {
            if (this.getUserById(id)) {
                return;
            }

            user = {
                id: id,
                name: user.name,
                avatar: user.avatar
            };

            this.users.push(user);

            return user;
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
        key: 'onUserAdded',
        value: function onUserAdded(listener) {
            this._listeners['user-added'].push(listener);
        }
    }]);

    return UsersRepository;
}();

exports.default = UsersRepository;

},{}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VotesRepository = function () {
    function VotesRepository(firebase, userId) {
        _classCallCheck(this, VotesRepository);

        this.firebase = firebase;
        this.userId = userId;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
        this.votes = {};
    }

    _createClass(VotesRepository, [{
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
        value: function onVotesChange(questionId, listener) {
            var _this = this;

            this.votes[questionId] = {};

            this.firebase.child('votes/' + questionId).on('child_added', function (data) {
                var voteId = data.val();
                var userId = data.key();
                _this.votes[questionId][userId] = voteId;
                listener(_this.votes[questionId]);
            });

            this.firebase.child('votes/' + questionId).on('child_changed', function (data) {
                var voteId = data.val();
                var userId = data.key();
                _this.votes[questionId][userId] = voteId;
                listener(_this.votes[questionId]);
            });
        }
    }]);

    return VotesRepository;
}();

exports.default = VotesRepository;

},{}]},{},[1])


//# sourceMappingURL=build.js.map
