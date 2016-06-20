import React from 'react';

const LogIn = (props) => {
    return (
        <div className="app-contest__slide">

            <div className="app-contest__header">
                <h1 className="sg-text-bit">
                    <span className="sg-text-bit__hole">
                        <div className="sg-logo sg-logo--small">

                        </div>
                    </span>
                    Data Contest
                </h1>
            </div>

            <p className="sg-text">Do you like contests? Do you enjoy getting prizes? This thing might be for you.</p>

            <div className="app-contest__action js-log-in">
                <a className="sg-button-primary sg-button-primary--full"
                    onClick={props.handleClick}>
                    <div className="sg-button-primary__hole">
                        Join the fun!
                    </div>
                </a>
            </div>

        </div>
    )
};

export default LogIn;
