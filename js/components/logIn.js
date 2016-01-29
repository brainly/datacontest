import React from 'react';

const LogIn = React.createClass({
    handleClick() {
        this.props.user.authenticate();
    },
    render() {
        return(
            <div className="app-contest__slide">

                <div className="app-contest__header">
                    <h1 className="mint-text-bit">
                        <span className="mint-text-bit__hole">
                            <div className="mint-logo mint-logo--small">

                            </div>
                        </span>
                        Data Contest
                    </h1>
                </div>

                <p className="mint-text">Do you like contests? Do you enjoy getting prizes? This thing might be for you.</p>

                <div className="app-contest__action js-log-in">
                    <a className="mint-button-primary mint-button-primary--full"
                        onClick={this.handleClick}>
                        <div className="mint-button-primary__hole">
                            Join the fun!
                        </div>
                    </a>
                </div>

            </div>
        )
    }
});

export default LogIn;
