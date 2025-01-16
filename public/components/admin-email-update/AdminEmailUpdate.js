import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

function AdminEmailUpdate() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');

    function _init() {
        _setEventListeners();
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "AdminEmailUpdate";

        div.innerHTML = `<h4 class="mb-4">
    <a href="/admin/profile" class="me-2 bi-chevron-left" data-js="module-link" title="Volver"></a>
    Información de perfil
</h4>
<div class="content">
    <form data-js="form">
        <div class="mb-3">
            <label>Nuevo email</label>
            <input type="email" class="form-control p-2" name="newEmail" placeholder="example@example.com" autocomplete="off" required>
        </div>
        <div class="mb-5">
            <label>Repetir email</label>
            <input type="email" class="form-control p-2" name="repeatNewEmail" placeholder="example@example.com" autocomplete="off" required>
        </div>
        <div class="text-end">
            <button type="submit" name="submit" class="btn btn-warning px-4 py-2">
                <span class="spinner-border-sm spinner-border d-none me-2"></span>
                <span>Actualizar</span>
            </button>
        </div>
</div>
`;

        return div;
    }

    function _setEventListeners(){
        _formElement.onsubmit = _onSubmitForm.bind(_formElement);
    }

    function _onSubmitForm(event) {
        event.preventDefault();

        const data = {
            newEmail: _formElement['newEmail'].value,
            repeatNewEmail: _formElement['repeatNewEmail'].value,
        };

        if (data.newEmail !== data.repeatNewEmail) {
            SwtError.fire({title: 'Los emails no coinciden'}).then();
            return;
        }

        disableSubmitButton(_formElement['submit']);

        setTimeout(() => {
            fetch('/api/v1/users/profile/email', {
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
                        SwtSuccess.fire({title: 'Email actualizado'}).then();
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

    _init.call(_self);
}

const profileEmail = new AdminEmailUpdate();

export default profileEmail;