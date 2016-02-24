import React from 'react';

const Answer = (props) => {
    const handleChange = () => props.votes.vote(props.user.id, props.questionId, props.answer.id);
    const inputId = `answer-${props.questionId}-${props.answer.id}`;
    let className = 'app-contest__answer';
    let votes = '';

    if(props.highlight) {
        className += ' app-contest__answer--correct';
    }

    if(props.showVoters) {
        votes = `(${props.voters.length} votes)`;
    }

    return (
        <div className={className}>
            <div className="mint-label mint-label--large mint-label--emphasised mint-label--secondary">
                <div className="mint-label__icon">

                    <div className="mint-radio">
                        <input id={inputId}
                               className="mint-radio__element"
                               name="answer"
                               type="radio"
                               onChange={handleChange} />
                        <label className="mint-radio__ghost" htmlFor={inputId}></label>
                    </div>

                </div>
                <label className="mint-label__text" htmlFor={inputId}>
                    {props.answer.text} {votes}
                </label>
            </div>
        </div>
    );
};

export default Answer;
