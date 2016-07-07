function trackJSError(e) {
    const ie = window.event || {};
    const errMsg = e.message || ie.errorMessage;
    const errSrc = (e.filename || ie.errorUrl) + ': ' + (e.lineno || ie.errorLine);

    ga('send', 'exception', {
        'exDescription': `${errSrc} - ${errMsg}`,
        'exFatal': false
    });
}

window.addEventListener('error', trackJSError, false);
