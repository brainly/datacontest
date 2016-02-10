var fb = new Firebase("https://datacontest.firebaseio.com");

var results = {
};

var questions = {};
var votes = {};
var users = {};

fb.child('users/').on('value', data => {
    users = data.val();

    fb.child('votes/').on('value', data => {
        votes = data.val();

        fb.child('questions/').on('value', data => {
            questions = data.val();

            showResults();
        });
    });
});

function showResults() {
    results = {};

    for(var questionId in questions) {
        var correct = questions[questionId].correct;

        if(votes && votes[questionId]) {
            for(var userId in votes[questionId]) {

                if(votes[questionId][userId] == correct) {
                    console.log('correct!', userId, questionId);
                    results[userId] = results[userId] ? results[userId] + 1 : 1;
                }
            }
        }
    }

    var resultsArr = [];
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

    console.log(resultsArr);

    var app = document.querySelector('#app');

    app.innerHTML = '';

    resultsArr.forEach(function(result) {
        var li = document.createElement('li');

        li.innerHTML = '<img src="' + result.user.avatar + '" style="height: 30px"/> ' + result.user.name + ' ' + result.score;

        app.appendChild(li);
    });

}

