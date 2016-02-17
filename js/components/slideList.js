import React from 'react';

import Question from '../components/question';
import LogIn from '../components/logIn';
import Welcome from '../components/welcome';
import Results from '../components/results';
import QuestionRepository from '../question-repository';
import UsersRepository from '../users-repository';
import VotesRepository from '../votes-repository';
import User from '../user';
import SlideController from '../slide-controller';

class SlideList extends React.Component{
    constructor() {
        super();

        this.state =  {
            questions : [],
            users: [],
            votes: {},
            slideIndex: 0,
            showCorrectAnswers: false
        };

        this.firebaseRef = new Firebase("https://datacontest.firebaseio.com");
    }

    componentWillMount() {
        this.initUser();
    }

    initSlideController() {
        let sc = new SlideController(this.firebaseRef);

        sc.onSlideChange(this.goToSlide.bind(this));

        //TODO refactor
        window.addEventListener('keydown', (ev) => {
            if(ev.keyCode === 39) {
                sc.nextSlide();
            } else if(ev.keyCode === 37) {
                sc.prevSlide();
            }
        });
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
                answers : answerList,
                correct: question.correct
            };
        });
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

    showError(e) {
        console.error(e);
    }

    initQuestionRepository() {
        this.questionRepo = new QuestionRepository(this.firebaseRef);
        this.questionRepo.onReady((questions) => {
            this.questions = this.getQuestionList(questions);
            this.setState({
                questions: this.questions
            });
        });
        this.questionRepo.onError(this.showError);
    }

    initUser() {
        this.user = new User(this.firebaseRef);

        if(this.user.isAuthenticated()) {
            this._onLogin();
        }

        this.user.onAuth(() => {
            if(this.user.isAuthenticated()) {
                this._onLogin();
            } else {
                this.goToSlide(0);
            }
        });
    }

    _onLogin() {
        this.initSlideController();
        this.initUsers();
        this.initVotes();
        this.initQuestionRepository();

        this.goToSlide(1);
        this.usersRepo.register(this.user);
    }

    initUsers() {
        this.usersRepo = new UsersRepository(this.firebaseRef);
        this.usersRepo.onUserAdded(() => {
            this.setState({ users: this.usersRepo.users });
        });
        this.usersRepo.onError(this.showError.bind(this));
    }

    initVotes() {
        this.votesRepo = new VotesRepository(this.firebaseRef);
        this.votesRepo.onVotesChange(() => {
            this.setState({ votes: this.votesRepo.votes });
        });
        this.votesRepo.onError(this.showError.bind(this));
    }

    toggleCorrectAnswers() {
        this.setState({ showCorrectAnswers : !this.state.showCorrectAnswers});
    }

    handleLoginClick() {
        this.user.authenticate();
    }

    render() {
        const questions = this.state.questions;
        const questionNodes = questions.map((question) => {
            return (
                <Question
                    question={question}
                    user={this.user}
                    votes={this.votesRepo}
                    showCorrectAnswers={this.state.showCorrectAnswers}
                    handleClick={this.toggleCorrectAnswers.bind(this)}
                    key={question.id}/>
            );
        });

        return (
            <div className="app-contest" style={this.style}>
                <div className="app-contest__slides">
                    <LogIn handleClick={this.handleLoginClick.bind(this)}/>
                    <Welcome users={this.state.users} user={this.user} />
                    {questionNodes}
                    <Results users={this.state.users} questions={this.state.questions} votes={this.state.votes} />
                </div>
            </div>
        )
    }
}

export default SlideList;
