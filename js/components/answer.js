import React from 'react';

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.votesRepo = props.votes;
    }

    handleChange() {
        this.votesRepo.vote(this.questionId, this.answerId);
    }

    componentWillMount() {
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
