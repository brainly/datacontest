import React from 'react';
import Answer from '../components/answer.js';

const Solution = (props) => {
    const votes = props.votes;
    const question = props.question;
    const answerNodes = question.answers.map((answer)  => {
        const voters = props.votes.getVotersForAnswer(question.id, answer.id);

        return (
            <Answer
                answer={answer}
                questionId={question.id}
                user={props.user}
                votes={votes}
                key={answer.id}
                showVoters={true}
                voters={voters}
                highlight={answer.id === question.correct}/>
        );
    });

    return (
        <div className="app-contest__slide app-contest__slide--colored">
            <div className="app-contest__question">
                <h1 className="sg-header-secondary">
                    {question.id + 1}. {props.question.text}
                </h1>

                <div className="app-content_answers">
                    {answerNodes}
                </div>
            </div>
        </div>
    );

};
export default Solution;
