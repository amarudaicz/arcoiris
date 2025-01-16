import {Paginator} from "/public/components/paginator/Paginator.js";
import {SwtError} from "/public/components/util/BoxMessage.js";
import {adminNav} from "/public/components/admin-nav/AdminNav.js";

function UserList() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _topFormElement = _rootElement.querySelector('[data-js="top-form"]');
    const _entryElement = _rootElement.querySelector('[data-js="entries"]');
    const _statusElement = _rootElement.querySelector('[data-js="status"]');

    const _paginator = new Paginator(_rootElement.querySelector('[data-component="Paginator"]'));

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        _topFormElement['sync-button'].onclick = _fetchData;

        _topFormElement.onsubmit = function (event) {
            event.preventDefault();
            _filterEntries.call(_topFormElement, event);
            return false;
        }
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "UserList";

        div.innerHTML = `
            <h4 class="mb-4">Usuarios</h4>
            <form data-js="top-form">
                <div class="row g-1">
                    <div class="col-auto">
                        <button type="button" name="sync-button" class="btn btn-warning">
                            <span class="spinner-border spinner-border-sm d-none"></span>
                            <i class="bi-arrow-repeat"></i>
                        </button>
                    </div>
                    <div class="col"></div>
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
                        <th>Usuario</th>
                        <th>Email</th>
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
            fetch('/api/v1/users', {
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

        data.users.forEach(user => {
            _entryElement.append(_createEntry(user));
        });

        _filterEntries();
    }

    function _createEntry(user) {
        const element = document.createElement('tr');

        element._data = user;

        element.innerHTML = `
            <td data-colname="Imagen">
                <div class="user-image"></div>
            </td>
            <td data-colname="Usuario">
                <div>${user.name}</div>
                <div class="small text-secondary">#${user.id.toString()}</div>
            </td>
            <td data-colname="Email">
                <div class="text-secondary">${user.email}</div>
            </td>
        `;

        return element;
    }

    function _filterEntries() {
        let filteredEntries = Array.from(_entryElement.children);

        filteredEntries.forEach((element) => {
            element.classList.add('d-none');
        });

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

        _paginator.setEntries(filteredEntries)
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

        adminNav.select('users');
    }

    _init.call(_self);
}

const userList = new UserList();

export default userList;