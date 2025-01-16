import {FeaturedCatalogUpdate} from "/public/components/featured-catalog-update/FeaturedCatalogUpdate.js";
import {ProductDetailUpdate} from "/public/components/product-detail-update/ProductDetailUpdate.js";
import {ProductImageUpdate} from "/public/components/product-image-update/ProductImageUpdate.js";
import {Paginator} from "/public/components/paginator/Paginator.js";
import {adminNav} from "/public/components/admin-nav/AdminNav.js";
import {currencyFormat} from "/public/components/util/Util.js";
import {SwtError} from "/public/components/util/BoxMessage.js";

function ProductList() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _entryElement = _rootElement.querySelector('[data-js="entries"]');
    const _statusElement = _rootElement.querySelector('[data-js="status"]');
    const _topFormElement = _rootElement.querySelector('[data-js="top-form"]');

    const _paginator = new Paginator(_rootElement.querySelector('[data-component="Paginator"]'));
    const _productImageUpdate = new ProductImageUpdate();
    const _productDetailUpdate = new ProductDetailUpdate();
    const _featuredCatalogUpdate = new FeaturedCatalogUpdate();

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        _topFormElement['sync-button'].onclick = _fetchData;

        _topFormElement['filter'].onchange = _filterEntries;

        _topFormElement['featured-pdf-button'].onclick = _featuredCatalogUpdate.open;

        _topFormElement.onsubmit = function (event) {
            event.preventDefault();
            _filterEntries.call(_topFormElement, event);
            return false;
        }
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "ProductList";

        div.innerHTML = `
            <h4 class="mb-4">Productos</h4>
            <form data-js="top-form">
                <div class="row g-2">
                    <div class="col-sm-auto">
                        <button type="button" name="sync-button" class="btn btn-warning">
                            <span class="spinner-border spinner-border-sm d-none"></span>
                            <i class="bi-arrow-repeat"></i>
                        </button>
                    </div>
                    <div class="col-sm-auto">
                        <button type="button" name="featured-pdf-button" class="btn btn-secondary">
                            <span class="bi-file-pdf"></span> Destacados
                        </button>
                    </div>
                    <div class="col"></div>
                    <div class="col-sm-auto">
                        <div class="input-group">
                            <span class="input-group-text bi-filter"></span>
                            <select class="form-control" name="filter">
                                <option value="0" selected>Todos</option>
                                <option value="2">Destacados</option>
                                <option value="1">Sin imágenes</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-auto">
                        <div class="input-group">
                            <input class="form-control" type="text" name="search" placeholder="Buscar...">
                            <span class="input-group-text"><i class="bi-search"></i></span>
                        </div>
                    </div>
                </div>
            </form>
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="entries" data-js="entries"><!---entries---></tbody>
                <tbody data-js="status">
                    <tr>
                        <td colspan="5" class="text-center">
                            <span class="text-secondary spinner-border"></span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="text-center">
                            <span class="text-secondary">Sin resultados</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5" class="text-danger text-center">
                            <i class="bi-x-lg"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div data-component="Paginator">
                <!--Paginator-->
            </div>
        `;

        return div;
    }

    function _fetchData() {
        _setLoading();

        _paginator.reset();

        setTimeout(() => {
            fetch('/api/v1/products', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        _processData(resp.data);
                        return;
                    }

                    if (resp.code === 401) {
                        location.href = '/admin/sign-out';
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    _setError();
                    SwtError.fire({text: reason}).then();
                });
        }, 400);
    }

    function _processData(data) {
        _entryElement.innerHTML = '';

        data['products'].forEach(product => {
            _entryElement.append(_createEntry(product));
        });

        _filterEntries.call(_topFormElement);
    }

    function _createEntry(product) {
        const element = document.createElement('tr');

        if (product['productDetail']['imagePath'].indexOf('default') === -1)
            element.setAttribute('data-image', '1');
        else
            element.setAttribute('data-image', '0');

        element.setAttribute('data-featured', product['featured'].toString());

        element.innerHTML = `<td>
            <img class="product-image" data-js="product-image" loading="lazy" src="/${product['productDetail']['imagePath']}"  alt="Imagen que representa al producto en la fila">
        </td>
        <td data-colname="Producto">
            <div data-js="changeable">${product['description']}</div>
            <div class="small text-secondary">#${product['code'].toString()}</div>
        </td>
        <td data-colname="Categoria" >${product['category']['description']}</td>
        <td data-colname="Precio">${currencyFormat(product['price'])}</td>
        <td data-colname="Acción">
            <button type="button" data-js="button" class="btn btn-sm btn-warning bi-image"></button>
            <button type="button" data-js="button" class="btn btn-sm btn-warning bi-star-fill"></button>
        </td>`;

        const buttons = element.querySelectorAll('[data-js="button"]');

        buttons[0].onclick = _onUpdateImage.bind(buttons[0], product, element);

        buttons[1].onclick = _onUpdateProduct.bind(buttons[1], product);

        return element;
    }

    function _filterEntries() {
        let filteredEntries = Array.from(_entryElement.children);

        filteredEntries.forEach((element) => {
            element.classList.add('d-none');
        });

        if (_topFormElement['filter'].value === '1') {
            filteredEntries = filteredEntries.filter(element => {
                return element.dataset.image === '0';
            });
        }

        if (_topFormElement['filter'].value === '2') {
            filteredEntries = filteredEntries.filter(element => {
                return element.dataset.featured === 'true';
            });
        }

        if (_topFormElement.search.value.length > 0) {
            filteredEntries = filteredEntries.filter((element) => {
                return element.textContent.toLowerCase().indexOf(_topFormElement.search.value.toLowerCase()) !== -1;
            });
        }

        if (filteredEntries.length > 0) {
            _setLoaded();
        } else {
            _setNoResults();
        }

        _paginator.setEntries(filteredEntries);
    }

    function _setLoaded() {
        _entryElement.classList.remove('d-none');
        _statusElement.classList.add('d-none');
        _statusElement.children[0].classList.add('d-none');
        _statusElement.children[2].classList.add('d-none');
        _statusElement.children[1].classList.add('d-none');

        _topFormElement['sync-button'].disabled = false;
        _topFormElement['sync-button'].children[0].classList.add('d-none');
        _topFormElement['sync-button'].children[1].classList.remove('d-none');
    }

    function _setLoading() {
        _entryElement.classList.add('d-none');
        _statusElement.classList.remove('d-none');
        _statusElement.children[0].classList.remove('d-none');
        _statusElement.children[1].classList.add('d-none');
        _statusElement.children[2].classList.add('d-none');

        _topFormElement['sync-button'].disabled = true;
        _topFormElement['sync-button'].children[0].classList.remove('d-none');
        _topFormElement['sync-button'].children[1].classList.add('d-none');
    }

    function _setNoResults() {
        _entryElement.classList.add('d-none');
        _statusElement.classList.remove('d-none');
        _statusElement.children[0].classList.add('d-none');
        _statusElement.children[2].classList.add('d-none');
        _statusElement.children[1].classList.remove('d-none');

        _topFormElement['sync-button'].disabled = false;
        _topFormElement['sync-button'].children[0].classList.add('d-none');
        _topFormElement['sync-button'].children[1].classList.remove('d-none');
    }

    function _setError() {
        _entryElement.classList.add('d-none');
        _statusElement.classList.remove('d-none');
        _statusElement.children[0].classList.add('d-none');
        _statusElement.children[1].classList.add('d-none');
        _statusElement.children[2].classList.remove('d-none');

        _topFormElement['sync-button'].disabled = false;
        _topFormElement['sync-button'].children[0].classList.add('d-none');
        _topFormElement['sync-button'].children[1].classList.remove('d-none');
    }

    function _onUpdateImage(product, element) {
        _productImageUpdate.setProduct(product);

        _productImageUpdate.open();

        _productImageUpdate.onsuccess = function () {
            element.setAttribute('data-image', '1');

            const img = element.querySelector('[data-js="product-image"]');

            img.src = `/${product['productDetail']['imagePath']}?ver=${(new Date()).getTime()}`
        };
    }

    function _onUpdateProduct(product) {
        _productDetailUpdate.setProduct(product);
        _productDetailUpdate.open();
        _productDetailUpdate.onsuccess = function () {
        };
    }

    this.getRoot = function () {
        return _rootElement;
    }

    this.onFocus = function () {
        _fetchData();

        adminNav.select('products');
    }

    _init.call(_self);
}

const productList = new ProductList();

export default productList;