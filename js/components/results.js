import React from 'react';
import UserAvatar from '../components/userAvatar';

const Results = (props) => {
    const getResults = () => {
        let questions = props.questions;
        let votes = props.votes;
        let usersArray = props.users;
        let usersMap = {};
        let results = {};
        let resultsArr = [];

        //create a map of users (with UIDs being keys)
        usersArray.forEach(user => usersMap[user.id] = user);

        //count points for each user
        for (const questionId in questions) {
            if (questions.hasOwnProperty(questionId) && votes && votes[questionId]) {
                const correct = questions[questionId].correct;

                for (const userId in votes[questionId]) {
                    if (votes[questionId].hasOwnProperty(userId) && votes[questionId][userId] === correct) {
                        results[userId] = results[userId] ? results[userId] + 1 : 1;
                    }
                }
            }
        }

        //create a handy results array - used for rendering
        for (const userId in results) {
            if (results.hasOwnProperty(userId) && usersMap[userId]) {
                resultsArr.push({
                    user: usersMap[userId],
                    score: results[userId]
                });
            }
        }

        //sort results by number of points
        resultsArr = resultsArr.sort((a, b) => b.score - a.score);

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
                        <UserAvatar user={result.user}/>
                        {result.user.name}
                    </div>
                </td>
                <td>
                    {result.score}
                </td>
            </tr>
        )
    });

    if (userResults.length) {

        resultsTable = (
            <table className="app-contest__results">
                <thead>
                <tr>
                    <th></th>
                    <th>
                        user
                    </th>
                    <th>
                        points
                    </th>
                </tr>
                </thead>
                <tbody>
                {userResults}
                </tbody>
            </table>
        );
    }

    return (
        <div className="app-contest__slide">
            <div className="app-contest__header">
                <h1 className="mint-text-bit mint-text-bit--not-responsive mint-text-bit--xlarge">
                    Thank you for voting!
                </h1>
            </div>

            {resultsTable}

        </div>
    )
};

export default Results;
