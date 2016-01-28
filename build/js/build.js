(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./firebase.js');

},{"./firebase.js":2}],2:[function(require,module,exports){
'use strict';

var _user = require('./user.js');

var _user2 = _interopRequireDefault(_user);

var _questionRepository = require('./question-repository.js');

var _questionRepository2 = _interopRequireDefault(_questionRepository);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = new Firebase("https://datacontest.firebaseio.com");
var user = new _user2.default(ref);
var questionRepo = null;

var $btn = document.getElementById('js-log-in');
var $name = document.getElementById('js-user-name');
var $avatar = document.getElementById('js-user-avatar');
var $email = document.getElementById('js-user-email');
var $questions = document.getElementById('js-questions');

$btn.addEventListener('click', function () {
    user.authenticate().then(function () {
        $name.innerHTML = user.name;
        $email.innerHTML = user.email;
        $avatar.src = user.avatar;

        questionRepo = new _questionRepository2.default(ref);

        questionRepo.onReady(function (questions) {
            questions.forEach(function (question, idx) {
                var li = document.createElement('li');
                li.innerHTML = question.text;

                $questions.appendChild(li);
            });
        });

        questionRepo.onQuestionChange(function (questionIdx) {
            console.log('qchange', questionIdx);
            if (questionIdx === -1) {
                return;
            }

            if (questionIdx - 1 >= 0) {
                $questions.childNodes[questionIdx - 1].style.fontWeight = 'normal';
            }

            $questions.childNodes[questionIdx].style.fontWeight = 'bold';
        });
    }).catch(function (error) {
        alert(error);
    });
});

},{"./question-repository.js":3,"./user.js":4}],3:[function(require,module,exports){
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
        }, this._trigger.bind('error'));

        currentQuestionRef.on("value", function (snapshot) {
            _this.currentQuestion = snapshot.val();
            _this._trigger('question-change', _this.currentQuestion);
        }, this._trigger.bind('error'));
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
