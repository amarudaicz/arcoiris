function AdminNav() {
    const _self = this;
    const _rootElement = _createRootElement();

    function _init() {
        _setupEventListeners();

        document.body.append(_rootElement);
    }

    function _setupEventListeners() {
        _rootElement.onclick = function (event) {
            if (event.target === _rootElement) {
                _closeAside();
                return;
            }

            let element = event.target;

            while (element) {
                if (element.dataset.js === "module-link") {
                    _closeAside();
                    return;
                }

                element = element.parentElement;
            }
        }
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "AdminNav";

        div.innerHTML = `<aside>
            <ol class="list-unstyled m-0 p-0">
                <li data-name="customers">
                    <a class="text-decoration-none d-block" href="/admin/customers" data-js="module-link">
                        <i class="bi-people ps-2 pe-3 d-inline-block"></i> Clientes
                    </a>
                </li>
                <li data-name="products">
                    <a class="text-decoration-none d-block" href="/admin/products" data-js="module-link">
                        <i class="bi-dropbox ps-2 pe-3 d-inline-block"></i> Productos
                    </a>
                </li>
                <li data-name="orders">
                    <a class="text-decoration-none d-block" href="/admin/orders" data-js="module-link">
                        <i class="bi-file-text ps-2 pe-3 d-inline-block"></i> Ordenes
                    </a>
                </li>
                <li data-name="users">
                    <a class="text-decoration-none d-block" href="/admin/users" data-js="module-link">
                        <i class="bi-people ps-2 pe-3 d-inline-block"></i> Usuarios
                    </a>
                </li>
            </ol>
        </aside>`;

        return div;
    }

    function _toggleVisibility() {
        if (_rootElement.classList.contains('visible')) {
            return _closeAside();
        }
        _openAside();
    }

    function _openAside() {
        _rootElement.classList.add('visible');
    }

    function _closeAside() {
        _rootElement.classList.remove('visible');
    }

    this.select = function (name) {
        let selected = _rootElement.querySelector('.selected');

        if (selected) {
            selected.classList.remove('selected');
        }

        if (name === null) return;

        let item = _rootElement.querySelector(`[data-name=${name}]`);

        if (item) {
            item.firstElementChild.classList.add('selected');
        }
    }

    this.open = _openAside;

    this.close = _closeAside;

    this.toggleVisibility = _toggleVisibility;

    _init.call(_self);
}

export const adminNav = new AdminNav();