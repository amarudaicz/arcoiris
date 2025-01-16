import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

function AdminPasswordUpdate() {
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners(){
        _formElement.onsubmit = _onSubmitForm.bind(_formElement);

        Array.from(_formElement['eye']).forEach(button => {
            button.onclick = _toggleHiddenPassword;
        });
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "AdminPasswordUpdate";

        div.innerHTML = `<h4 class="mb-4">
    <a href="/admin/profile" class="me-2 bi-chevron-left" data-js="module-link" title="Volver"></a>
    Cambiar contraseña
</h4>
<div class="content">
    <form data-js="form">
        <div class="mb-3">
            <label>Contraseña actual</label>
            <div class="input-group">
                <input type="password" class="form-control p-2" name="password" required autocomplete="off">
                <button type="button" name="eye" class="input-group-text"><i class="bi-eye"></i></button>
            </div>
        </div>
        <div class="mb-3">
            <label>Nueva contraseña</label>
            <div class="input-group mb-1">
                <input type="password" class="form-control p-2" name="newPassword" required autocomplete="off">
                <button type="button" name="eye" class="input-group-text"><i class="bi-eye"></i></button>
            </div>
            <div class="password-meter" data-js="password-meter">
              <div class="password-progress"></div>
            </div>
        </div>
        <div class="mb-5">
            <label>Repetir contraseña</label>
            <div class="input-group">
                <input type="password" class="form-control p-2" name="repeatNewPassword" required autocomplete="off">
                <button type="button" name="eye" class="input-group-text"><i class="bi-eye"></i></button>
            </div>
        </div>
        <div class="text-end">
            <button type="submit" name="submit" class="btn btn-warning px-4 py-2">
                <span class="spinner-border-sm spinner-border d-none me-2"></span>
                <span>Actualizar</span>
            </button>
        </div>
    </form>
</div>`;

        return div;
    }

    function _toggleHiddenPassword() {
        if (this.firstElementChild.classList.contains('bi-eye')) {
            _formElement['eye'][0].firstElementChild.classList.replace('bi-eye', 'bi-eye-slash');
            _formElement['eye'][1].firstElementChild.classList.replace('bi-eye', 'bi-eye-slash');
            _formElement['eye'][2].firstElementChild.classList.replace('bi-eye', 'bi-eye-slash');
            _formElement['password'].type = 'text';
            _formElement['newPassword'].type = 'text';
            _formElement['repeatNewPassword'].type = 'text';
            return;
        }
        _formElement['eye'][0].firstElementChild.classList.replace('bi-eye-slash', 'bi-eye');
        _formElement['eye'][1].firstElementChild.classList.replace('bi-eye-slash', 'bi-eye');
        _formElement['eye'][2].firstElementChild.classList.replace('bi-eye-slash', 'bi-eye');
        _formElement['password'].type = 'password';
        _formElement['newPassword'].type = 'password';
        _formElement['repeatNewPassword'].type = 'password';
    }

    function _onSubmitForm(event) {
        event.preventDefault();

        const data = {
            password: _formElement['password'].value,
            newPassword: _formElement['newPassword'].value,
            repeatNewPassword: _formElement['repeatNewPassword'].value,
        };

        if (data.newPassword !== data.repeatNewPassword) {
            SwtError.fire({title: 'Las contraseñas no coinciden'}).then();
            return;
        }

        disableSubmitButton(_formElement['submit']);

        setTimeout(() => {
            fetch('/api/v1/users/profile/password', {
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
                        SwtSuccess.fire({title: 'Contraseña actualizada'}).then();
                        enableSubmitButton(_formElement['submit']);
                        return;
                    }

                    if (resp.code === 401) {
                        location.reload();
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

    this.getRoot = function () {
        return _rootElement;
    }

    this.onFocus = function () {
    }

    _init.call(this);
}

const adminPasswordUpdate = new AdminPasswordUpdate();

export default adminPasswordUpdate;