import React from 'react';

import Question from '../components/question';
import LogIn from '../components/logIn';
import Welcome from '../components/welcome';
import Results from '../components/results';
import QuestionRepository from '../question-repository';
import UsersRepository from '../users-repository';
import VotesRepository from '../votes-repository';
import User from '../user';

class SlideList extends React.Component{
    constructor() {
        super();

        this.state =  {
            questions : [],
            users: [],
            slideIndex: 0
        };

        this.firebaseRef = new Firebase("https://datacontest.firebaseio.com");
    }

    componentWillMount() {
        this.initUser();
        this.initUsers();
        this.votesRepo = new VotesRepository(this.firebaseRef);
        this.initQuestionRepository();
    }

    getQuestionList(questions) {
        return questions.map((question, index) => {
            const answerList = question.answers.map((answer, index) => {
                return {
                    id: index,
                    text: answer
                };
            });

            return {
                id: index,
                text : question.text,
                answers : answerList
            };
        });
    }

    changeQuestion(questionIndex = 0) {
        const slideIndex = parseInt(questionIndex, 10) + 2;
        this.goToSlide(slideIndex);
    }

    goToSlide(slide = 0) {
        const slideIndex = parseInt(slide, 10);
        this.style = {
            left: -(slideIndex * 100) + 'vw'
        };

        this.setState({
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
        this.user.onAuth(() => {
            if(this.user.isAuthenticated()) {
                this.changeQuestion(0);
                this.usersRepo.register(this.user);
            } else {
                this.goToSlide(0);
            }
        });
    }

    initUsers() {
        this.usersRepo = new UsersRepository(this.firebaseRef);
        this.usersRepo.onUserAdded(() => {
            this.setState({ users: this.usersRepo.users });
        });
    }

    handleLoginClick() {
        this.user.authenticate();
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
                    <LogIn handleClick={this.handleLoginClick.bind(this)}/>
                    <Welcome users={this.state.users} user={this.user} />
                    {questionNodes}
                    <Results />
                </div>
            </div>
        )
    }
}

export default SlideList;
