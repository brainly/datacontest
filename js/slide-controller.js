class SlideController {
    constructor(firebase) {
        this.firebase = firebase;
        this._listeners = {
           'slide-change': [],
            'error': []
        };
        this.currentSlide = null;

        let currentPanelRef = this.firebase.child('/current-slide');

        currentPanelRef.on('value', (snapshot) => {
            this.currentSlide = snapshot.val();
            this._trigger('slide-change', this.currentSlide);
        }, this._trigger.bind(this, 'error'));
    }

    _trigger(action, data) {
        (this._listeners[action]).forEach((callback) => {
            callback(data);
        });
    }

    onError(listener) {
        this._listeners['error'].push(listener);
    }

    onSlideChange(listener) {
        this._listeners['slide-change'].push(listener);
    }

    goToSlide(slide = 0) {
        this.firebase.child('/current-slide').set(slide, e => {
            if(e) {
                this._trigger('error', e);
            }
        });
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        if(this.currentSlide > 0 ) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
}

export default SlideController;