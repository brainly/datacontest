class VotesRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
        this.votes = {};

        console.log('construct');
    }

    vote(userId, questionId, answerId) {
        let votesRef = (this.firebase).child(`votes/${questionId}/${userId}`);
        votesRef.set(answerId, (error) => {
            if(error) {
                //TODO add error handling
                alert('We are unable to process your vote :( ' + error);
            }
        });
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
