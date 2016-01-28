class VotesRepository {
    constructor(firebase, userId) {
        this.userId = userId;
        this.firebase = firebase;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
    }

    vote(questionId, answerId) {
        let votesRef = (this.firebase).child(`votes/${questionId}/${this.userId}`);
        votesRef.set(answerId);
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    onError(listener) {
        this._listeners['error'].push(listener);
    }

    onVotesChange(questionId, listener) {
        (this.firebase).child(`votes/${questionId}/`).on('child_added', (data) => {
            let votes = data.val();
            listener(votes);
        });
    }
}

export default VotesRepository;