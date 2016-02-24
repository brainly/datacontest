import React from 'react';
import Answer from '../components/answer.js';

const Question = (props) => {
    const votes = props.votes;
    const question = props.question;
    const answerNodes = question.answers.map((answer)  => {
        return (
            <Answer answer={answer} questionId={question.id} user={props.user} votes={votes} key={answer.id}/>
        );
    });
    let voters = '';
    if(props.showVoters) {
        const voteCount = votes.getVotersForQuestion(question.id).length;
        voters = `(${voteCount} votes)`;
    }

    return (
        <div className="app-contest__slide app-contest__slide--colored">
            <div className="app-contest__question">
                <h1 className="mint-header-secondary">
                    {question.id + 1}. {props.question.text}
                </h1>

                <div className="app-content_answers">
                    {answerNodes}
                </div>

                <p className="mint-text mint-text--light">{voters}</p>
            </div>
        </div>
    );

};
export default Question;
