function UserProfile() {
    const _self = this;
    const _onUpdateCallback = [];
    let _promise = null;

    function _init() {
    }

    function _fetchProfile() {
        _promise = fetch('/api/v1/users/profile', {
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.code === 200) {
                    _onUpdateCallback.forEach(fn => {
                        fn(resp.data);
                    });

                    return resp.data
                }

                if (resp.code === 401) {
                    location.href = '/admin/sign-out';
                    return;
                }

                throw new Error(resp.message);
            })
            .catch(reason => {
                console.error(reason);
            });
    }

    this.getProfile = function (onUpdateCallback = null) {
        if (!_promise) {
            _fetchProfile();
        }

        if (onUpdateCallback) {
            _self.onUpdate(onUpdateCallback);
        }

        return _promise;
    }

    this.onUpdate = function (fn) {
        _onUpdateCallback.push(fn);
    }

    this.reload = function () {
        _fetchProfile();
    }

    _init.call(this);
}

export const userProfile = new UserProfile();