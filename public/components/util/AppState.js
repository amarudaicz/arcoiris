function AppState() {
    const _self = this;
    this.subscribers = [];
    this.state = {
        customer: null,
        cart: []
    };
    this.isStateLoaded = false;

    //Initialized component
    function _init() {
        if (!_self.isStateLoaded) {
            _self.loadState();
        }
    }

    // Method to subscribe to changes in the app state
    this.subscribe = function (subscriberCallback) {
        this.subscribers.push(subscriberCallback);
        subscriberCallback(_self.state);
    };

    // Method to unsubscribe from changes in the app state
    this.unsubscribe = function (subscriberCallback) {
        const index = _self.subscribers.indexOf(subscriberCallback);
        if (index !== -1) {
            _self.subscribers.splice(index, 1);
        }
    };

    // Method to get the state of the app
    this.getState = function () {
        return _self.state;
    }

    // Method to update the app state and notify subscribers
    this.setState = function (state) {
        _self.state = state; 
        _self.notifyAll();
    };

    // Method to save the state of the app to the session storage
    this.saveState = function () {
        localStorage.setItem('appState', JSON.stringify(_self.state));
    }

    // Method to load the state of the app from the session storage
    this.loadState = function () {
        if (!_self.isStateLoaded) {
            const storedState = localStorage.getItem('appState');
            if (storedState) {
                _self.state = JSON.parse(storedState);
                _self.notifyAll();
                _self.isStateLoaded = true;
            }
        }
    }

    //Method to notify all subscribers when an update has been made
    this.notifyAll = function () {
        _self.subscribers.forEach((subscriberCallback) => {
            subscriberCallback(_self.state);
        });
    }

    //Initialize component
    _init.call(this);
}

export const appState = new AppState();