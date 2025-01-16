import {Paginator} from "/public/components/paginator/Paginator.js";
import {adminNav} from "/public/components/admin-nav/AdminNav.js";
import {SwtError} from "/public/components/util/BoxMessage.js";
import {currencyFormat} from "/public/components/util/Util.js";

function OrderView() {
    const _rootElement = _createHTML();
    const _orderIdElement = _rootElement.querySelector('[data-js="order-id"]');
    const _orderDateElement = _rootElement.querySelector('[data-js="order-date"]');
    const _orderNoteElement = _rootElement.querySelector('[data-js="order-note"]');
    const _orderTotalElement = _rootElement.querySelector('[data-js="order-total"]');
    const _orderPaymentMethodElement = _rootElement.querySelector('[data-js="order-payment-method"]');
    const _customerNameElement = _rootElement.querySelector('[data-js="customer-name"]');
    const _customerDniElement = _rootElement.querySelector('[data-js="customer-dni"]');
    const _entryContainerElement = _rootElement.querySelector('[data-js="entry-container"]');
    const _downloadCSVButtonElement = _rootElement.querySelector('[data-js="download-csv"]');
    const _statusElement = _rootElement.querySelector('[data-js="status"]');
    const _paginator = new Paginator(_rootElement.querySelector('[data-component="Paginator"]'));

    function _createHTML() {
        const div = document.createElement('div');

        div.className = "OrderView";

        div.innerHTML = `<div class="row g-1 mb-3">
    <div class="col-auto">
        <a href="/admin/orders" class="h4 me-2 bi-chevron-left" data-js="module-link" title="Volver"></a>
    </div>
    <div class="col">
        <h4>Orden de compra #<span class="fw-bold" data-js="order-id"><!--order id--></span></h4>
    </div>
    <div class="col-auto">
        <button type="button" name="download-csv" data-js="download-csv" class="btn btn-primary btn-sm">
            <span class="spinner-border spinner-border-sm d-none me-2"></span>
            <span class="me-2">Descargar</span>
            <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 548.29 548.291" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                    <g> 
                        <path d="M486.2,196.121h-13.164V132.59c0-0.399-0.064-0.795-0.116-1.2c-0.021-2.52-0.824-5-2.551-6.96L364.656,3.677 c-0.031-0.034-0.064-0.044-0.085-0.075c-0.629-0.707-1.364-1.292-2.141-1.796c-0.231-0.157-0.462-0.286-0.704-0.419 c-0.672-0.365-1.386-0.672-2.121-0.893c-0.199-0.052-0.377-0.134-0.576-0.188C358.229,0.118,357.4,0,356.562,0H96.757 C84.893,0,75.256,9.649,75.256,21.502v174.613H62.093c-16.972,0-30.733,13.756-30.733,30.73v159.81 c0,16.966,13.761,30.736,30.733,30.736h13.163V526.79c0,11.854,9.637,21.501,21.501,21.501h354.777 c11.853,0,21.502-9.647,21.502-21.501V417.392H486.2c16.966,0,30.729-13.764,30.729-30.731v-159.81 C516.93,209.872,503.166,196.121,486.2,196.121z M96.757,21.502h249.053v110.006c0,5.94,4.818,10.751,10.751,10.751h94.973v53.861 H96.757V21.502z M258.618,313.18c-26.68-9.291-44.063-24.053-44.063-47.389c0-27.404,22.861-48.368,60.733-48.368 c18.107,0,31.447,3.811,40.968,8.107l-8.09,29.3c-6.43-3.107-17.862-7.632-33.59-7.632c-15.717,0-23.339,7.149-23.339,15.485 c0,10.247,9.047,14.769,29.78,22.632c28.341,10.479,41.681,25.239,41.681,47.874c0,26.909-20.721,49.786-64.792,49.786 c-18.338,0-36.449-4.776-45.497-9.77l7.38-30.016c9.772,5.014,24.775,10.006,40.264,10.006c16.671,0,25.488-6.908,25.488-17.396 C285.536,325.789,277.909,320.078,258.618,313.18z M69.474,302.692c0-54.781,39.074-85.269,87.654-85.269 c18.822,0,33.113,3.811,39.549,7.149l-7.392,28.816c-7.38-3.084-17.632-5.939-30.491-5.939c-28.822,0-51.206,17.375-51.206,53.099 c0,32.158,19.051,52.4,51.456,52.4c10.947,0,23.097-2.378,30.241-5.238l5.483,28.346c-6.672,3.34-21.674,6.919-41.208,6.919 C98.06,382.976,69.474,348.424,69.474,302.692z M451.534,520.962H96.757v-103.57h354.777V520.962z M427.518,380.583h-42.399 l-51.45-160.536h39.787l19.526,67.894c5.479,19.046,10.479,37.386,14.299,57.397h0.709c4.048-19.298,9.045-38.352,14.526-56.693 l20.487-68.598h38.599L427.518,380.583z"></path> 
                    </g> 
                </g>
            </svg>
        </button>
    </div>
</div>
<div class="row g-2 align-items-stretch mb-2">
    <div class="col-sm">
        <div class="order-box">
            <p class="mb-3 small">CLIENTE</p>
            <p class="text-center fw-bold mb-0" data-js="customer-name"><!--customer name--></p>
            <p class="text-center small text-muted mb-0" data-js="customer-dni"><!--customer name--></p>
        </div>
    </div>
    <div class="col-sm">
        <div class="order-box">
            <p class="mb-3 small">FECHA</p>
            <p class="text-center fw-bold" data-js="order-date"><!--order date--></p>
        </div>
    </div>
    <div class="col-sm">
        <div class="order-box">
            <p class="mb-3 small">TOTAL</p>
            <p class="text-center fw-bold" data-js="order-total"><!--order total--></p>
        </div>
    </div>
</div>
<div class="row g-2 align-items-stretch">
    <div class="col-sm-4">
        <div class="order-box">
            <p class="mb-3 small">FORMA DE PAGO</p>
            <p class="text-center mb-0" data-js="order-payment-method"><!--order payment method--></p>
        </div>
    </div>
    <div class="col-sm-8">
        <div class="order-box">
            <p class="mb-3 small">NOTA</p>
            <p data-js="order-note"><!--order note--></p>
        </div>
    </div>
</div>
<table class="custom-table">
    <tbody class="entries" data-js="entry-container">
        <!--entries-->
    </tbody>
    <tbody data-js="status">
        <tr>
            <td colspan="5" class="text-center">
                <span class="text-secondary spinner-border"></span>
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
</div>`;

        return div;
    }

    function _constructor() {
        _setLoading();

        _downloadCSVButtonElement.onclick = _downloadCSV;
    }

    function _fetchData() {
        _setLoading();

        const orderId = location.pathname.trim().split('/')[3];

        setTimeout(() => {
            fetch(`/api/v1/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        _processData(resp.data);
                    } else if (resp.code === 401) {
                        location.href = '/admin/sign-out';
                    } else throw new Error(resp.message);
                })
                .catch(reason => {
                    _setError();
                    SwtError.fire({title: reason}).then();
                });
        }, 300);
    }

    function _processData(data) {
        _entryContainerElement.innerHTML = "";

        _orderIdElement.textContent = data.order.id.toString();

        _orderDateElement.textContent = new Date(data.order.createdDate).toLocaleString();

        _orderTotalElement.textContent = currencyFormat(data.order.total);

        _orderNoteElement.textContent = data.order.note;

        _orderPaymentMethodElement.textContent = data.order.paymentMethod;

        _customerNameElement.textContent = data.order.customerName;

        _customerDniElement.textContent = data.order.customerDni;

        data.items.forEach(item => {
            _entryContainerElement.append(_createEntry(item));
        });

        _filterEntries();
    }

    function _createEntry(item) {
        const element = document.createElement('tr');

        element.innerHTML = `
            <td data-colname="Producto">
                <div>${item.description}</div>
                <div class="small text-secondary">#${item.number.toString()}</div>
            </td>
            <td data-colname="Cantidad">${item.quantity}</td>
            <td data-colname="Total">${currencyFormat(item.price * item.quantity)}</td>
        `;

        return element;
    }

    function _filterEntries() {
        let filteredEntries = Array.from(_entryContainerElement.children);

        filteredEntries.forEach((element) => {
            element.classList.add('d-none');
        });

        _paginator.setEntries(filteredEntries);

        _setLoaded();
    }

    function _clear() {
        _entryContainerElement.innerHTML = "";

        _orderIdElement.textContent = '';

        _orderDateElement.textContent = '';

        _orderTotalElement.textContent = '';

        _customerNameElement.textContent = '';

        _customerDniElement.textContent = '';

        _paginator.reset();
    }

    function _downloadCSV() {
        const orderId = location.pathname.trim().split('/')[3];

        _showLoadingDownloadButton();

        setTimeout(() => {
            fetch(`/api/v1/orders/${orderId}/download`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.code === 200) {
                        _showLoadedDownloadButton();
                        const link = document.createElement('a');
                        link.href = resp.data.csv;
                        link.download = resp.data.filename;
                        link.click();
                    } else if (resp.code === 401) {
                        location.href = '/admin/sign-out';
                    } else throw new Error(resp.message);
                })
                .catch(reason => {
                    _showLoadedDownloadButton();
                    SwtError.fire({title: reason}).then();
                });
        }, 300);
    }

    function _showLoadedDownloadButton() {
        _downloadCSVButtonElement.children[0].classList.add('d-none');
        _downloadCSVButtonElement.children[1].classList.remove('d-none');
        _downloadCSVButtonElement.disabled = false;
    }

    function _showLoadingDownloadButton() {
        _downloadCSVButtonElement.children[0].classList.remove('d-none');
        _downloadCSVButtonElement.children[1].classList.add('d-none');
        _downloadCSVButtonElement.disabled = true;
    }

    function _setLoaded() {
        _entryContainerElement.classList.remove('d-none');
        _statusElement.classList.add('d-none');
        _statusElement.children[0].classList.add('d-none');
        _statusElement.children[1].classList.add('d-none');
    }

    function _setLoading() {
        _entryContainerElement.classList.add('d-none');
        _statusElement.classList.remove('d-none');
        _statusElement.children[0].classList.remove('d-none');
        _statusElement.children[1].classList.add('d-none');
    }

    function _setError() {
        _entryContainerElement.classList.add('d-none');
        _statusElement.classList.remove('d-none');
        _statusElement.children[0].classList.add('d-none');
        _statusElement.children[1].classList.remove('d-none');
    }


    this.getRoot = function () {
        return _rootElement;
    }

    this.onFocus = function () {
        _fetchData();

        _clear();

        adminNav.select('orders');
    }

    _constructor.call(this);
}

const orderView = new OrderView();

export default orderView;