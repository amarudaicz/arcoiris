import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

function CustomerPasswordUpdate() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        _formElement.onsubmit = function (event) {
            event.preventDefault();
            _onSubmitForm.call(_formElement, event);
            return false;
        }

        Array.from(_formElement['eye-button']).forEach(button => {
            button.onclick = _togglePasswordVisibility;
        });
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="CustomerPasswordUpdate"]');

        element.className = "CustomerPasswordUpdate";

        element.innerHTML = `<div class="row">
        <div class="col-md order-1 order-md-0">
            <form data-js="form">
                <div class="mb-3">
                    <label>Contraseña actual</label>
                    <div class="input-group">
                        <input type="password" class="form-control p-3" name="password" required>
                        <button type="button" name="eye-button" class="input-group-text bi-eye"></button>
                    </div>
                </div>
                <div class="mb-3">
                    <label>Nueva contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control p-3" name="newPassword" required>
                        <button type="button" name="eye-button" class="input-group-text bi-eye"></button>
                    </div>
                </div>
                <div class="mb-4">
                    <label>Repetir nueva contraseña</label>
                    <div class="input-group">
                        <input type="password" class="form-control p-3" name="repeatNewPassword" required>
                        <button type="button" name="eye-button" class="input-group-text bi-eye"></button>
                    </div>
                </div>
                <div class="text-end">
                    <button type="submit" name="submit" class="btn btn-warning p-3 px-5">
                        <span class="spinner-border spinner-border-sm me-2 d-none"></span>
                        <span>Actualizar</span>
                    </button>
                </div>
            </form>
        </div>
        <div class="col-md order-0 order-md-1 text-center">
            <img src="/public/images/change-password.png" alt="">
        </div>
    </div>`;

        return element;
    }

    function _togglePasswordVisibility() {
        if (_formElement['eye-button'][0].classList.contains('bi-eye')) {

            Array.from(_formElement['eye-button']).forEach(button => {
                button.classList.replace('bi-eye', 'bi-eye-slash');
            });

            _formElement['password'].type = 'text';

            _formElement['newPassword'].type = 'text';

            _formElement['repeatNewPassword'].type = 'text';

            return;
        }

        Array.from(_formElement['eye-button']).forEach(button => {
            button.classList.replace('bi-eye-slash', 'bi-eye');
        });

        _formElement['password'].type = 'password';

        _formElement['newPassword'].type = 'password';

        _formElement['repeatNewPassword'].type = 'password';
    }

    function _onSubmitForm() {
        disableSubmitButton(_formElement['submit']);

        const data = {
            password: _formElement['password'].value,
            newPassword: _formElement['newPassword'].value,
            repeatNewPassword: _formElement['repeatNewPassword'].value,
        };

        setTimeout(() => {
            fetch('/api/v1/customers/profile/password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        _formElement.reset();
                        SwtSuccess.fire({title: 'La contraseña se actualizo con éxito'}).then();
                        enableSubmitButton(_formElement['submit']);
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    enableSubmitButton(_formElement['submit']);
                    SwtError.fire({title: reason}).then();
                })
        }, 400);
    }

    _init.call(_self);
}

new CustomerPasswordUpdate();