class VotesRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
        this.votes = {};

        (this.firebase).child('votes/').on('value', data => {
            this.votes = data.val();
            this._trigger('votes-change');
        });
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

    onVotesChange(listener) {
        this._listeners['votes-change'].push(listener);
    }
}

export default VotesRepository;
