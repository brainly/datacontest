class VotesRepository {
    constructor(firebase, userId) {
        this.firebase = firebase;
        this.userId = userId;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
        this.votes = {};
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
        this.votes[questionId] = {};

        (this.firebase).child(`votes/${questionId}`).on('child_added', (data) => {
            let voteId = data.val();
            let userId = data.key();
            this.votes[questionId][userId] = voteId;
            listener(this.votes[questionId]);
        });

        (this.firebase).child(`votes/${questionId}`).on('child_changed', (data) => {
            let voteId = data.val();
            let userId = data.key();
            this.votes[questionId][userId] = voteId;
            listener(this.votes[questionId]);
        });
    }
}

export default VotesRepository;