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

    return (
        <div className="app-contest__slide">
            <div className="app-contest__question">
                <h1 className="mint-header-secondary">
                    {props.question.text}
                </h1>

                <div className="app-content_answers">
                    {answerNodes}
                </div>
            </div>
        </div>
    );

};
export default Question;
