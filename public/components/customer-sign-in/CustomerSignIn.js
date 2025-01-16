import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError} from "/public/components/util/BoxMessage.js";
import {appState} from "/public/components/util/AppState.js";

function CustomerSignIn() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');
    const _viewElements = _rootElement.querySelectorAll('[data-js="view"]');
    const _eyeButtonElement = _rootElement.querySelector('[data-js="eye-button"]');
    const _customerDniElement = _rootElement.querySelector('[data-js="customer-dni"]');
    const _customerNameElement = _rootElement.querySelector('[data-js="customer-name"]');
    const _signOutButtonElement = _rootElement.querySelector('[data-js="sign-out-button"]');

    function _init() {
        _changeToLoadingView();

        _formElement.onsubmit = _onSubmitCredentialForm.bind(_formElement);

        _eyeButtonElement.onclick = _togglePasswordVisibility;

        _signOutButtonElement.onclick = _onSignOut;

        _fetchProfile();

        appState.subscribe(_loadCustomerProfileState);
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="CustomerSignIn"]');

        element.className = 'CustomerSignIn';

        element.innerHTML = `<div class="content">
    <div class="view" data-js="view">
        <p class="h5 mb-5 text-center">Acceso Clientes</p>
        <form class="mb-4" data-js="form">
            <div class="mb-4 position-relative">
                <label for="dni">DNI | CUIT</label>
                <input id="dni" type="text" class="form-control p-3" name="dni" required>
            </div>
            <div class="mb-4 position-relative">
                <label for="password">Contraseña</label>
                <div class="input-group">
                    <input id="password" type="password" class="form-control p-3" name="password" minlength="6" autocomplete="off" required>
                    <button type="button" name="change-password-visibility" class="input-group-text" data-js="eye-button" aria-description="Change password visibility"><i class="bi-eye"></i></button>
                </div>
            </div>
            <div class="text-end">
                <button type="submit" name="submit" class="btn btn-primary p-3 w-100">
                    <span class="spinner-border spinner-border-sm d-none me-2"></span>
                    <span>Ingresar</span>
                </button>
            </div>
        </form>
    </div>
    <div class="view customer d-none" data-js="view">
        <div class="header">
            <div class="text-center">
                <img class="img-thumbnail customer-image mb-3" src="/public/images/customer.png" alt="Customer image">
            </div>
            <p class="h5 mb-1 fw-bold text-center" data-js="customer-name"><!--customer-name--></p>
            <p class="mb-4 text-muted text-center" data-js="customer-dni"><!--customer-dni--></p>
        </div>
        <div class="main">
            <div class="row g-2 justify-content-end">
                <div class="col-sm-auto">
                    <a href="/profile/password" class="btn btn-primary w-100">
                        <span>Cambiar contraseña</span>
                    </a>
                </div>
                <div class="col-sm-auto">
                    <button type="button" class="btn btn-danger w-100" data-js="sign-out-button">
                        <span class="spinner-border-sm spinner-border d-none me-2"></span>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="view loading d-none" data-js="view">
        <span class="spinner-border"></span>
    </div>
</div>`;

        return element;
    }

    function _fetchProfile() {
        fetch('/api/v1/customers/profile', {
            method: 'GET', headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(resp => {
                enableSubmitButton(_formElement['submit']);

                if (resp.code === 200) {
                    appState.setState(Object.assign(appState.getState(), {
                        customer: resp.data['profile']
                    }));
                    appState.saveState();
                    return;
                }

                if (resp.code === 401) {
                    appState.setState(Object.assign(appState.getState(), {
                        customer: null
                    }));
                    appState.saveState();
                    return;
                }

                throw new Error(resp.message);
            })
            .catch(reason => {
                SwtError.fire({title: reason}).then();
                enableSubmitButton(_formElement['submit']);
            });
    }

    function _loadCustomerProfileState() {
        if (appState.getState().customer) {
            _customerNameElement.textContent = appState.getState().customer.name;
            _customerDniElement.textContent = appState.getState().customer.dni;
            _changeToCustomerView();
        } else {
            _changeToSignInView();
        }
    }

    function _togglePasswordVisibility() {
        if (this.firstElementChild.classList.contains("bi-eye")) {
            this.firstElementChild.classList.replace("bi-eye", "bi-eye-slash");
            _formElement['password']['type'] = "text";
        } else {
            this.firstElementChild.classList.replace("bi-eye-slash", "bi-eye");
            _formElement['password']['type'] = "password";
        }
    }

    function _changeToSignInView() {
        _viewElements[0].classList.remove('d-none');
        _viewElements[1].classList.add('d-none');
        _viewElements[2].classList.add('d-none');
    }

    function _changeToCustomerView() {
        _viewElements[0].classList.add('d-none');
        _viewElements[1].classList.remove('d-none');
        _viewElements[2].classList.add('d-none');
    }

    function _changeToLoadingView() {
        _viewElements[0].classList.add('d-none');
        _viewElements[1].classList.add('d-none');
        _viewElements[2].classList.remove('d-none');
    }

    function _onSubmitCredentialForm(event) {
        event.preventDefault();

        const data = {};

        data.dni = _formElement['dni'].value;

        data.password = _formElement['password'].value;

        disableSubmitButton(_formElement['submit']);

        setTimeout(() => {
            fetch('/api/v1/auth/customers/sign-in', {
                method: 'POST', headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json'
                }, body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        appState.getState().customer = resp.data['profile'];
                        appState.notifyAll();
                        appState.saveState();
                        enableSubmitButton(_formElement['submit']);
                        return;
                    }
                    throw new Error(resp.message);
                })
                .catch(reason => {
                    SwtError.fire({title: reason}).then();
                    enableSubmitButton(_formElement['submit']);
                });
        }, 400);

        return false;
    }

    function _onSignOut() {
        disableSubmitButton(_signOutButtonElement);

        setTimeout(() => {
            fetch('/api/v1/auth/sign-out', {
                method: 'POST', headers: {
                    'Accept': 'application/json'
                }
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        appState.getState().customer = null;
                        appState.notifyAll();
                        appState.saveState();
                        enableSubmitButton(_signOutButtonElement);
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    enableSubmitButton(_signOutButtonElement);
                    SwtError.fire({title: reason}).then();
                });
        }, 400);
    }

    _init.call(_self);
}

new CustomerSignIn();