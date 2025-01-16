function AppStore() {
    const _this = this;
    let _subscriptions = [];
    let _state = {};

    function _constructor() {
        _this.unSerialize();
    }

    this.getState = function () {
        return _state;
    }

    this.subscribe = function (listener) {
        _subscriptions.push(listener);
    }

    this.dispatch = function (type) {
        _subscriptions.forEach(listener => {
            listener(type);
        });
    }

    this.removeSubscription = function (listener) {
        _subscriptions = _subscriptions.filter((fn => {
            return fn !== listener;
        }));
    }

    this.serialize = function () {
        localStorage.setItem('state', JSON.stringify(_state));
    }

    this.unSerialize = function () {
        if (localStorage.getItem('state')) {
            _state = JSON.parse(localStorage.getItem('state'));
        }
    }

    _constructor.call(this);
}

export const appStore = new AppStore();