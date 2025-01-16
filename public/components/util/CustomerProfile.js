function CustomerProfile() {
    let _promise = new Promise(_resolver);

    function _constructor() {
    }

    function _resolver(resolve, reject) {
        setTimeout(() => {
            fetch('/api/v1/customers/profile')
                .then(resp => resp.json())
                .then(resp => {
                    resolve(resp);
                })
                .catch(reason => {
                    reject(reason);
                });
        }, 400);
    }

    this.getProfile = function () {
        _promise = new Promise(_resolver);

        return _promise;
    }

    _constructor.call(this);
}

export const customerProfile = new CustomerProfile();