import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

export function ProductDetailUpdate() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');
    const _closeButtonElement = _rootElement.querySelector('[data-js="close-button"]');
    let _product = null;

    function _init() {
        _setupEventListeners();

        document.body.append(_rootElement);
    }

    function _setupEventListeners(){
        _closeButtonElement.onclick = _self.close;

        _formElement.onsubmit = _onSubmitForm.bind(_formElement);

        _formElement['cancel'].onclick = _self.close;

        _rootElement.firstElementChild.onclick = function (event) {
            event.cancelBubble = true;
        }

        _rootElement.onclick = _self.close;
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "ProductDetailUpdate";

        div.innerHTML = `<div class="content">
    <div class="row mb-4">
        <div class="col">
            <p class="fw-bold mb-0 modal-title"><span class="bi-star-fill me-2"></span>Producto Destacado</p>
        </div>
        <div class="col-auto">
            <button class="btn mb-0 p-0" data-js="close-button"><i class="bi-x-lg"></i></button>
        </div>
    </div>
    <form data-js="form">
        <div class="mb-5">
            <label>Descripción adicional</label>
            <textarea name="additionalDescription" class="form-control"></textarea>
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

    function _onSubmitForm(event) {
        event.preventDefault();

        disableSubmitButton(_formElement['submit']);

        const data = {}

        data.additionalDescription = _formElement['additionalDescription'].value.replaceAll('\n', '<br>');

        setTimeout(() => {
            fetch(`/api/v1/products/${_product['code']}`, {
                method: 'POST', headers: {
                    'Accept': 'application/json',
                }, body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(_onSubmitSuccess)
                .catch(_onSubmitError);
        }, 400);

        return false;
    }

    function _onSubmitSuccess(resp) {
        if (resp.code === 200) {
            SwtSuccess.fire({title: 'El producto se actualizó exitosamente',}).then();

            _product['productDetail']['additionalDescription'] = _formElement['additionalDescription'].value;

            _self.close();

            enableSubmitButton(_formElement['submit']);

            if (_self.onsuccess) _self.onsuccess();

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

    this.setProduct = function (product) {
        _product = product;

        _formElement['additionalDescription'].value = product['productDetail']['additionalDescription'].replaceAll('<br>', '\n');
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

    this.onsuccess = null;

    _init.call(_self);
}