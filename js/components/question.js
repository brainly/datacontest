import React from 'react';
import Answer from '../components/answer.js';

const Question = React.createClass({
    render() {
        const question = this.props.question;
        const answerNodes = question.answers.map((answer)  => {
            return (
                <Answer answer={answer} questionId={question.id} user={this.props.user} key={answer.id}/>
            );
        });

        return (
            <div className="app-contest__slide">
                <div className="app-contest__question">

                    <h1 className="mint-header-secondary">
                        {this.props.question.text}
                    </h1>

                    <div className="app-content_answers">
                        {answerNodes}
                    </div>
                </div>
            </div>
        );
    }
});

export default Question;
