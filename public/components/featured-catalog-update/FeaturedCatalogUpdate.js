import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

export function FeaturedCatalogUpdate() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');
    const _closeButtonElement = _rootElement.querySelector('[data-js="close-button"]');

    function _init() {
        _setupEventListeners();

        document.body.append(_rootElement);
    }

    function _setupEventListeners() {
        _closeButtonElement.onclick = _self.close;

        _formElement.onsubmit = _onSubmitForm.bind(_formElement);

        _formElement['cancel'].onclick = _self.close;

        _rootElement.firstElementChild.onclick = function (event) {
            event.cancelBubble = true;
        }

        _rootElement.onclick = _self.close;

        _formElement['file'].onclick = _onClickFile;

        _formElement['file-hidden'].onchange = _onSelectFile;
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "FeaturedCatalogUpdate";

        div.innerHTML = `<div class="content">
    <div class="row mb-4">
        <div class="col">
            <p class="fw-bold mb-0 modal-title">
                <span class="bi-file-pdf me-2"></span>Catalogo Destacados
            </p>
        </div>
        <div class="col-auto">
            <button class="btn mb-0 p-0" data-js="close-button"><i class="bi-x-lg"></i></button>
        </div>
    </div>
    <form data-js="form">
        <div class="mb-5">
            <label for="file">Seleccionar archivo</label>
            <div class="input-group">
                <span class="input-group-text bi-file-pdf-fill"></span>
                <input id="file" type="text" class="form-control p-2" readonly name="file" placeholder="">
                <input type="file" name="file-hidden" required hidden="hidden">
            </div>
        </div>
        <div class="row g-2 justify-content-end">
            <div class="col-auto">
                <button type="button" name="cancel" class="btn py-2">Cancelar</button>
            </div>
            <div class="col-auto">
                <button type="submit" name="submit" class="btn btn-warning px-5 py-2">
                    <span class="spinner-border-sm spinner-border d-none me-2"></span>
                    <span>Actualizar</span>
                </button>
            </div>
        </div>
    </form>
</div>`;

        return div;
    }

    function _onClickFile() {
        _formElement['file-hidden'].click();
    }

    function _onSelectFile() {
        _formElement['file'].value = _formElement['file-hidden'].files[0].name
    }

    function _onSubmitForm(event) {
        event.preventDefault();

        disableSubmitButton(_formElement['submit']);

        const formData = new FormData(_formElement);

        setTimeout(() => {
            fetch(`/api/v1/products/catalog`, {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                }, body: formData
            })
                .then(resp => resp.json())
                .then(_onSubmitSuccess)
                .catch(_onSubmitError);
        }, 400);

        return false;
    }

    function _onSubmitSuccess(resp) {
        if (resp.code === 200) {
            SwtSuccess.fire({title: 'El catalogo se actualizó exitosamente',}).then();

            _self.close();

            enableSubmitButton(_formElement['submit']);

            return;
        }

        if (resp.code === 401) {
            location.href = '/admin/sign-out';
            return;
        }

        throw new Error(resp.message);
    }

    function _onSubmitError(reason) {
        enableSubmitButton(_formElement['submit']);

        SwtError.fire({text: reason}).then();
    }

    this.open = function () {
        _rootElement.classList.add('visible');

        document.documentElement.classList.add('no-scroll');
    }

    this.close = function () {
        _self.onsuccess = null;

        document.documentElement.classList.remove('no-scroll');

        _rootElement.classList.remove('visible');

        _formElement.reset();
    }

    _init.call(_self);
}