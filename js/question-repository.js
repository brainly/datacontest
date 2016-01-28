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

        questionsRef.once("value", (snapshot) => {
            this.questions = snapshot.val();
            this._trigger('ready', this.questions);
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