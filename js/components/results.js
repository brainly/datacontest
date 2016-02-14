import React from 'react';
import UserAvatar from '../components/userAvatar';

const Results = (props) => {
    const getResults = () => {
        // all the logic below moved from previous js file.
        let questions = props.questions;
        let votes = props.votes;
        let usersArray = props.users;
        let users = {};
        let results = {};
        let resultsArr = [];

        usersArray.forEach((user) => users[user.id] = user);

        for(var questionId in questions) {
            var correct = questions[questionId].correct;

            if(votes && votes[questionId]) {
                for(var userId in votes[questionId]) {
                    if(votes[questionId][userId] == correct) {
                        results[userId] = results[userId] ? results[userId] + 1 : 1;
                    }
                }
            }
        }

        for(var userId in results) {
            if(results.hasOwnProperty(userId) && users[userId]) {
                resultsArr.push({
                    user: users[userId],
                    score: results[userId]
                });
            }
        }

        resultsArr = resultsArr.sort(function(a,b) {
            return b.score - a.score;
        });

        return resultsArr;
    };

    const userResults = getResults().map((result, index) => {
        return (
            <tr className="result" key={index}>
                <td className="mint-text">
                    {index + 1}.
                </td>
                <td>
                    <div className="result__user">
                        <UserAvatar user={result.user} />
                        {result.user.name}
                    </div>
                </td>
                <td>
                    {result.score}
                </td>
            </tr>
        )
    });

    return (
        <div className="app-contest__slide">
            <div className="app-contest__header">
                <h1 className="mint-text-bit mint-text-bit--not-responsive mint-text-bit--xlarge">
                    Thank you for voting!
                </h1>
            </div>

            <table className="app-contest__results">
                <thead>
                <tr>
                    <th></th>
                    <th>
                        user
                    </th>
                    <th>
                        correct answers
                    </th>
                </tr>
                </thead>
                <tbody>
                    {userResults}
                </tbody>
            </table>

        </div>
    )
};

export default Results;
