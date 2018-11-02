class QuestionRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this.questions = null;

        this._listeners = {
            'ready': [],
            'question-change': [],
            'error': []
        };
    }

    loadQuestions({withAnswers = true}) {
        let questionsRef = this.firebase.child('/questions');

        questionsRef.once("value", (snapshot) => {
            this.questions = snapshot.val();

            if(withAnswers) {
                const correctAnswers = (this.firebase).child('/results');
                correctAnswers.once("value", (snapshot) => {
                    const answers = snapshot.val();

                    if(answers) {
                        answers.forEach((correct, idx) => {
                            this.questions[idx].correct = correct;
                        });
                    }

                    this._trigger('ready', this.questions);
                }, e => {
                    this._trigger('error', e);
                });
            } else {
                this._trigger('ready', this.questions);
            }
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
