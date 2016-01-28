class VoteRepository {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
            'votes-change': [],
            'error': []
        };
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