import React from 'react';
import ReactDOM from 'react-dom';
import SlideList from './components/slideList.js';

function start() {
    const isDev = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');

    // force HTTPS
    if(!isDev && location.protocol !== 'https:') {
        location.protocol = 'https:';
    }

    ReactDOM.render(
        <SlideList/>,
        document.getElementById('app')
    );
}

start();
