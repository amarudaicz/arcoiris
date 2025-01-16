import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError} from "/public/components/util/BoxMessage.js";

function AdminSignIn() {
    const _rootElement = _createRootElement();
    const _formsElement = _rootElement.querySelectorAll('[data-js="form"]');

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners(){
        _formsElement[0].onsubmit = function (event) {
            _onSubmitCredentials.call(_formsElement[0], event);
            return false;
        }

        _formsElement[0]['eye'].onclick = _onToggleHiddenPassword;
    }

    function _createRootElement() {
        const div = document.querySelector('[data-component="AdminSignIn"]');

        div.className = "AdminSignIn";

        div.innerHTML = `<h4 class="mb-4 text-center">Acceso Usuarios</h4>
<form class="mb-4" data-js="form">
    <div class="mb-4 position-relative">
        <label>Email</label>
        <input type="email" class="form-control p-3" name="email" required>
    </div>
    <div class="mb-4 position-relative">
        <label>Contraseña</label>
        <div class="input-group">
            <input type="password" class="form-control p-3" name="password" minlength="6" autocomplete="off" required>
            <button type="button" class="input-group-text" name="eye"><i class="bi-eye"></i></button>
        </div>
    </div>
    <div>
        <button type="submit" name="submit" class="btn btn-primary p-3 w-100">
            <span class="spinner-border spinner-border-sm d-none me-2"></span>
            <span>Ingresar</span>
        </button>
    </div>
</form>
<div class="text-center">
    <a href="/" class="go-back"><span class="bi-home-fill me-2"></span> Volver a <b>www.arcoirisferretera.com.ar</b></a>
</div>`;

        return div;
    }

    function _onToggleHiddenPassword() {
        if (this.firstElementChild.classList.contains("bi-eye")) {
            this.firstElementChild.classList.replace("bi-eye", "bi-eye-slash");

            _formsElement[0]['password'].type = "text";
        } else {
            this.firstElementChild.classList.replace("bi-eye-slash", "bi-eye");

            _formsElement[0]['password'].type = "password";
        }
    }

    function _onSubmitCredentials(response) {
        const data = {};

        if (response && response.credential) {
            data.credential = response.credential;
        } else {
            data.email = _formsElement[0]['email'].value;
            data.password = _formsElement[0]['password'].value;
        }

        disableSubmitButton(_formsElement[0]['submit']);

        setTimeout(() => {
            fetch('/api/v1/auth/users/sign-in', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        location.reload();
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    SwtError.fire({text: reason}).then();

                    enableSubmitButton(_formsElement[0]['submit']);
                });
        }, 400);
    }

    _init.call(this);
}

new AdminSignIn();