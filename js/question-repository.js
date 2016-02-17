class QuestionRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this.questions = null;

        this._listeners = {
            'ready': [],
            'question-change': [],
            'error': []
        };

        let questionsRef = this.firebase.child('/questions');
        let correctAnswers = this.firebase.child('/results');

        questionsRef.once("value", (snapshot) => {
            this.questions = snapshot.val();
            this._trigger('ready', this.questions);

            correctAnswers.once("value", (snapshot) => {
                const answers = snapshot.val();

                if(answers) {
                    answers.forEach((correct, idx) => {
                        this.questions[idx].correct = correct;
                    });
                }

                this._trigger('ready', this.questions);
            }, e => {
                console.log('User is not an admin.', e);
                this._trigger('ready', this.questions);
            });
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
}

export default QuestionRepository;