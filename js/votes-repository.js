class VoteRepository {
    constructor(firebase, userId) {
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

    onVotesChange(listener) {
        this._listeners['votes-change'].push(listener);
    }
}

export default VoteRepository;