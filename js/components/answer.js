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
            <div className="sg-label sg-label--large sg-label--emphasised sg-label--secondary">
                <div className="sg-label__icon">

                    <div className="sg-radio">
                        <input id={inputId}
                               className="sg-radio__element"
                               name="answer"
                               type="radio"
                               onChange={handleChange} />
                        <label className="sg-radio__ghost" htmlFor={inputId}></label>
                    </div>

                </div>
                <label className="sg-label__text" htmlFor={inputId}>
                    {props.answer.text} {votes}
                </label>
            </div>
        </div>
    );
};

export default Answer;
