import React from 'react';
import Question from '../components/question';
import LogIn from '../components/logIn';
import Welcome from '../components/welcome';
import QuestionRepository from '../question-repository';
import UsersRepository from '../users-repository';
import VotesRepository from '../votes-repository';
import User from '../user';

class SlideList extends React.Component{
    constructor() {
        super();

        this.state =  {
          questions : [],
          slideIndex: 0
        }
    }

    componentWillMount() {
        this.firebaseRef = new Firebase("https://datacontest.firebaseio.com");
        this.initQuestionRepository();
        this.initUser();
        this.initUsers();
        this.initVotesRepository();
    }

    getQuestionList(questions) {
        return questions.map((question, index) => {
            const answerList = question.answers.map((answer, index) => {
                return {
                    id: index + 1,
                    text: answer
                };
            });
            return {
                id: index + 1,
                text : question.text,
                answers : answerList
            };
        });
    }

    changeQuestion(questionIndex = 0) {
        const slideIndex = parseInt(questionIndex, 10) + 2;
        this.style = {
            left: -(slideIndex * 100) + 'vw'
        };

        this.setState({
            questions: this.questions,
            slideIndex: slideIndex
        });
    }

    showError() {}

    initQuestionRepository() {
        this.questionRepo = new QuestionRepository(this.firebaseRef);
        this.questionRepo.onReady((questions) => {
            this.questions = this.getQuestionList(questions);
            this.setState({
                questions: this.questions
            });
        });
        this.questionRepo.onQuestionChange(this.changeQuestion.bind(this));
        this.questionRepo.onError(this.showError);
    }

    initUser() {
        this.user = new User(this.firebaseRef);
        this.user.onAuth(this.changeQuestion.bind(this));
    }

    initUsers() {
        this.usersRepo = new UsersRepository(this.firebaseRef);
        this.usersRepo.register(this.user);
    }

    initVotesRepository() {
        this.votesRepo = new VotesRepository(this.firebaseRef, this.user.id);
    }

    render() {
        const questions = this.state.questions;
        const questionNodes = questions.map((question) => {
            return (
                <Question question={question} user={this.user} votes={this.votesRepo}key={question.id}/>
            );
        });


        return (
            <div className="app-contest" style={this.style}>
                <div className="app-contest__slides">
                    <LogIn user={this.user}/>
                    <Welcome usersRepo={this.usersRepo} user={this.user} />
                    {questionNodes}
                </div>
            </div>
        )
    }
}

export default SlideList;
