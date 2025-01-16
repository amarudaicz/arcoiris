import {disableSubmitButton, enableEntryButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

export function ProductImageUpdate() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');
    const _zoneElement = _rootElement.querySelector('[data-js="zone"]');
    const _zoneImageElement = _rootElement.querySelector('[data-js="zone-image"]');
    const _closeButtonElement = _rootElement.querySelector('[data-js="close-button"]');
    const _deleteButtonElement = _rootElement.querySelector('[data-js="delete-button"]');
    let _selectedImage = false;
    let _product = null;

    function _init() {
        _setupEventListeners();

        document.body.append(_rootElement);
    }

    function _setupEventListeners(){
        _closeButtonElement.onclick = _self.close;

        _formElement.onsubmit = _onSubmitForm.bind(_formElement);

        _formElement['cancel'].onclick = _self.close;

        _zoneElement.onclick = _browseImage;

        _deleteButtonElement.onclick = _deleteSelectedImage;

        _formElement['file'].onchange = _selectImage;

        _rootElement.firstElementChild.onclick = function (event) {
            event.cancelBubble = true;
        }

        _rootElement.onclick = _self.close;
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "ProductImageUpdate";

        div.innerHTML = `<div class="content">
    <div class="row mb-4">
        <div class="col">
            <p class="fw-bold mb-0 modal-title">Actualizar imagen</p>
        </div>
        <div class="col-auto">
            <button class="btn mb-0 p-0" data-js="close-button"><i class="bi-x-lg"></i></button>
        </div>
    </div>
    <div class="zone mb-5" data-js="zone">
        <div class="zone-image" data-js="zone-image" style="">
            <button type="button" class="btn btn-sm btn-danger" data-js="delete-button">
                <span class="bi-x-lg"></span>
            </button>
        </div>
        <div class="zone-label">
            <img src="/public/images/images.png" class="mb-3" alt="Icono utilizado para representar la ausencia de imagenes">
            <p class="mb-0">Hace <b>clic</b> para seleccionar una imagen</p>
        </div>
    </div>
    <form data-js="form">
        <input type="file" name="file" hidden required>
        <div class="row g-2 justify-content-end">
            <div class="col-auto">
                <button type="button" name="cancel" class="btn py-2">Cancelar</button>
            </div>
            <div class="col-auto">
                <button type="submit" name="submit" class="btn btn-success px-5 py-2">
                    <span class="spinner-border-sm spinner-border d-none me-2"></span>
                    <span>Subir</span>
                </button>
            </div>
        </div>
    </form>
</div>`;

        return div;
    }

    function _browseImage() {
        if (_selectedImage) return;

        _formElement['file'].click();
    }

    function _selectImage() {
        _selectedImage = true;

        const file = _formElement['file'].files[0];

        const fileURL = URL.createObjectURL(file);

        _zoneImageElement.style.backgroundImage = `url("${fileURL}")`;

        _rootElement.classList.add('loaded');
    }

    function _deleteSelectedImage(event) {
        event.cancelBubble = true;

        _rootElement.classList.remove('loaded');

        _zoneImageElement.removeAttribute('style');

        _formElement['file'].value = "";

        _selectedImage = false;
    }

    function _clear() {
        _rootElement.classList.remove('loaded');

        _zoneImageElement.removeAttribute('style');

        _formElement['file'].value = "";

        _selectedImage = false;

        _formElement.reset();
    }

    function _onSubmitForm(event) {
        event.preventDefault();

        disableSubmitButton(_formElement['submit']);

        const formData = new FormData(_formElement);

        setTimeout(() => {
            fetch(`/api/v1/products/${_product['code']}/image`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        _product['productDetail']['imagePath'] = resp.data['imagePath'];

                        if (_self.onsuccess) _self.onsuccess();

                        SwtSuccess.fire({title: 'La imagen se subió exitosamente',}).then();

                        _self.close();

                        _clear();

                        enableSubmitButton(_formElement['submit']);

                        return;
                    }

                    if (resp.code === 401) {
                        location.href = '/admin/sign-out';
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    enableSubmitButton(_formElement['submit']);
                    SwtError.fire({text: reason}).then();
                });
        }, 400);

        return false;
    }

    this.setProduct = function (product) {
        _product = product;
    }

    this.open = function () {
        _rootElement.classList.add('visible');

        document.documentElement.classList.add('no-scroll');
    }

    this.close = function () {
        _self.onsuccess = null;

        document.documentElement.classList.remove('no-scroll');

        _rootElement.classList.remove('visible');

        _clear();
    }

    this.onsuccess = null;

    _init.call(_self);
}