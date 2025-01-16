import {currencyFormat, getToday} from "/public/components/util/Util.js";
import {Paginator} from "/public/components/paginator/Paginator.js";
import {adminNav} from "/public/components/admin-nav/AdminNav.js";
import {SwtError} from "/public/components/util/BoxMessage.js";

function OrderList() {
    const _rootElement = _createRootElement();
    const _topFormElement = _rootElement.querySelector('[data-js="top-form"]');
    const _entryElement = _rootElement.querySelector('[data-js="entries"]');
    const _statusElement = _rootElement.querySelector('[data-js="status"]');
    const _paginator = new Paginator(_rootElement.querySelector('[data-component="Paginator"]'));
    let _fetchByDate = false;

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        _topFormElement['sync-button'].onclick = _fetchData;

        _topFormElement['dateFrom'].onchange = _fetchData;

        _topFormElement['dateFrom'].value = getToday();

        _topFormElement['dateTo'].onchange = _fetchData;

        _topFormElement['dateTo'].value = getToday();

        _topFormElement.onsubmit = function () {
            return false;
        }
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "OrderList";

        div.innerHTML = `
            <h4 class="mb-4">Ordenes de compra</h4>
            <form data-js="top-form">
                <div class="row g-1">
                    <div class="col-auto">
                        <button type="button" name="sync-button" class="btn btn-warning">
                            <span class="spinner-border spinner-border-sm d-none"></span>
                            <i class="bi-arrow-repeat"></i>
                        </button>
                    </div>
                    <div class="col-sm"></div>
                    <div class="col-sm-auto">
                        <div class="input-group">
                            <input class="form-control" type="date" name="dateFrom">
                            <input class="form-control" type="date" name="dateTo">
                            <span class="input-group-text"><i class="bi-calendar-date"></i></span>
                        </div>
                    </div>
                </div>
            </form>
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Total</th>
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
        if (this !== undefined && (this.name === 'dateFrom' || this.name === "dateTo")) {
            _fetchByDate = true;
        }

        _setLoading();

        _paginator.reset();

        let query = '';

        if (_fetchByDate) {
            const params = new URLSearchParams();

            params.append('from', _topFormElement['dateFrom'].value);

            params.append('to', _topFormElement['dateTo'].value);

            query = '?' + params.toString();
        }

        setTimeout(() => {
            fetch(`/api/v1/orders${query}`, {
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
        _entryElement.innerHTML = '';

        data.orders.forEach(order => {
            _entryElement.append(_createEntry(order));
        });

        _filterEntries.call(_topFormElement);
    }

    function _createEntry(order) {
        const element = document.createElement('tr');

        element._data = order;

        element.innerHTML = `
            <td data-colname="Fecha">
                <div>${new Date(order.createdDate).toLocaleString()}</div>
                <div class="small text-secondary">#${order.id.toString()}</div>
            </td>
            <td data-colname="Cliente">
                <p class="mb-0">${order.customerName}</p>
                <p class="mb-0 small text-muted">${order.customerDni}</p>
            </td>
            <td data-colname="Total">
                <p class="mb-0">${currencyFormat(order.total)}</p>
            </td>
            <td data-colname="Accion">
                <a class="btn btn-sm" href="/admin/orders/${order.id}" data-js="module-link"><i class="bi-chevron-right"></i></a>
            </td>
        `;

        return element;
    }

    function _filterEntries() {
        let filteredEntries = Array.from(_entryElement.children);

        filteredEntries.forEach((element) => {
            element.classList.add('d-none');
        });

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

    this.getRoot = function () {
        return _rootElement;
    }

    this.onFocus = function () {
        _fetchData();

        adminNav.select('orders');
    }

    _init.call(this);
}

const saleList = new OrderList();

export default saleList;