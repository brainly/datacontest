(function() {
   'use strict';


    const questionsArray = [
        {
            question: 'Kim jestes?',
            answers: [
                'Matim',
                'Karoliną',
                'Kondziem',
                'Nikim'
            ]
        },
        {
            question: 'Ile masz lat?',
            answers: [
                '1',
                '2',
                '22',
                '33'
            ]
        },
        {
            question: 'Jak masz się?',
            answers: [
                '1a',
                '2a',
                '22a',
                '33a'
            ]
        }
    ];

    const $appElement = document.querySelector('.js-app');
    let windowWidth = window.innerWidth;

    function renderAnswer(answer) {
        let $answerTemplate = document.importNode(document.querySelector('#answer-template'), true);
        let $answerContent = $answerTemplate.content.querySelector('.js-answer-content');
        let $answerClone;

        $answerContent.textContent = answer;
        $answerClone = document.importNode($answerTemplate.content, true);

        return $answerClone;
    }

    function renderQuestion(data) {
        let $questionTemplate = document.importNode(document.querySelector('#question-template'), true);
        let $questionContent = $questionTemplate.content.querySelector('.js-question-content');
        let $answersList = $questionTemplate.content.querySelector('.js-answers-list');
        let $questionClone;

        data.answers.forEach(function(answer) {
            $answersList.appendChild(renderAnswer(answer));
        });

        $questionContent.textContent = data.question;
        $questionClone = document.importNode($questionTemplate.content, true);

        $appElement.appendChild($questionClone);

    }

    function setSlidesWidth() {
        const $slides = Array.from(document.querySelectorAll('.js-slide'));

        $slides.forEach(function($slide) {
            $slide.style.width = windowWidth + 'px';
        });
    }

    function changeSlide(slideIndex) {
        $appElement.style.left = - (slideIndex * windowWidth) + 'px';
    }

    function start () {
        questionsArray.forEach(renderQuestion);
        setSlidesWidth();
    }

    start();

    window.changeSlide = changeSlide;

})();
