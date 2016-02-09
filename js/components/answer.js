import React from 'react';
import VotesRepository from '../votes-repository';

class Answer extends React.Component {
    constructor() {
        super()
    }

    handleChange() {
        this.votesRepo.vote(this.questionId, this.answerId);
    }

    componentWillMount() {
        this.firebaseRef = new Firebase("https://datacontest.firebaseio.com");
        this.votesRepo = new VotesRepository(this.firebaseRef, this.props.user.id);
    }

    render() {
        this.questionId = this.props.questionId;
        this.answerId = this.props.answer.id;

        const inputId = `answer-${this.questionId}-${this.answerId}`;

        return (
            <div className="answer">
                <div className="mint-label mint-label--large mint-label--emphasised mint-label--secondary">
                    <div className="mint-label__icon">

                        <div className="mint-radio">
                            <input id={inputId}
                                   className="mint-radio__element"
                                   name="answer"
                                   type="radio"
                                   onChange={this.handleChange.bind(this)} />
                            <label className="mint-radio__ghost" htmlFor={inputId}></label>
                        </div>

                    </div>
                    <label className="mint-label__text" htmlFor={inputId}>
                        {this.props.answer.text}
                    </label>
                </div>
            </div>
        );
    }
}

export default Answer;
