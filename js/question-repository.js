class QuestionRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this.questions = null;
        this.currentQuestion = null;

        this._listeners = {
            'ready': [],
            'question-change': [],
            'error': []
        };

        let questionsRef = this.firebase.child('/questions');
        let currentQuestionRef = this.firebase.child('/current-question');
        let correctAnswers = this.firebase.child('/results');

        questionsRef.once("value", (snapshot) => {
            this.questions = snapshot.val();
            this._trigger('ready', this.questions);

            correctAnswers.once("value", (snapshot) => {
                const answers = snapshot.val();

                if(answers) {
                    answers.forEach((correct, idx) => {
                        console.log(idx, correct, this.questions[idx]);
                        this.questions[idx].correct = correct;
                    });
                }

                this._trigger('ready', this.questions);
            }, e => {
                console.log('User is not an admin.', e);
                this._trigger('ready', this.questions);
            });
        }, this._trigger.bind(this, 'error'));

        currentQuestionRef.on("value", (snapshot) => {
            this.currentQuestion = snapshot.val();
            this._trigger('question-change', this.currentQuestion);
        }, this._trigger.bind(this, 'error'));
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    onError(listener) {
        this._listeners['error'].push(listener);
    }

    onReady(listener) {
        this._listeners['ready'].push(listener);
    }

    onQuestionChange(listener) {
        this._listeners['question-change'].push(listener);
    }
}

export default QuestionRepository;