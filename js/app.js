import React from 'react';
import ReactDOM from 'react-dom';
import SlideList from './components/slideList.js';

function start() {
    ReactDOM.render(
        <SlideList/>,
        document.getElementById('app')
    );
}

start();
