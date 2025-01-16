import {disableEntryButton, enableEntryButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";
import {adminNav} from "/public/components/admin-nav/AdminNav.js";
import userNav from "/public/components/user-nav/UserNav.js";

function Header() {
    const _rootElement = _createRootElement();
    const _navButtonElement = _rootElement.querySelector('[data-js="nav-button"]');
    const _accountButtonElement = _rootElement.querySelector('[data-js="account-button"]');
    const _syncButtonElement = _rootElement.querySelector('[data-js="sync-button"]');

    function _init() {
        _setupEventListeners();

        document.body.prepend(_rootElement);
    }

    function _setupEventListeners() {
        _navButtonElement.onclick = adminNav.toggleVisibility;

        _accountButtonElement.onclick = function (event) {
            event.cancelBubble = true;
            userNav.toggle()
        };

        _syncButtonElement.onclick = _onSync;
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "Header";

        div.innerHTML = `<div class="content">
    <div class="row w-100 g-1 align-items-center">
        <div class="col-auto">
            <div class="nav-button-wrapper" data-js="nav-button-wrapper">
                <button class="nav-button" data-js="nav-button" title="Menu">
                    <i class="bi-list"></i>
                </button>
            </div>
        </div>
        <div class="col">
            <span class="h3 mb-0" title="Pagina principal">Arcoiris Ferretera</span>
        </div>
        <div class="col-auto me-3">
            <button class="btn btn-sm btn-warning p-2 px-3" data-js="sync-button">
                <span class="bi-arrow-repeat"></span>
                <span class="spinner-border spinner-border-sm d-none"></span>
            </button>
        </div>
        <div class="col-auto">
            <button class="account-button" data-js="account-button"></button>
        </div>
    </div>
</div>`;

        return div;
    }

    function _onSync() {
        disableEntryButton(_syncButtonElement);

        const data = {token: '6b894a0b352fad5fa8841c84bf5f5585708b00e94f6091024bd25c5f'};

        setTimeout(() => {
            fetch('/api/v1/settings/sync', {
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
                        setTimeout(() => {location.reload()}, 4000);
                        SwtSuccess.fire({title: 'Sincronización completada. Lo estamos redireccionando...'}).then();
                        enableEntryButton(_syncButtonElement);
                        return
                    }

                    if (resp.code === 401) {
                        location.reload();
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    enableEntryButton(_syncButtonElement);
                    SwtError.fire({title: reason}).then();
                });
        }, 400);
    }

    this.showLoadingModule = function () {
        _rootElement.classList.remove('loaded');
        _rootElement.classList.add('loading');
    }

    this.hideLoadedModule = function () {
        _rootElement.classList.add('loaded');
        _rootElement.classList.remove('loading');
        _rootElement.ontransitionend = function () {
            _rootElement.ontransitionend = null;
            _rootElement.classList.remove('loaded', 'loading');
        }
    }

    this.showNavButton = function () {
        _rootElement.classList.add('visible');
    }

    this.hideNavButton = function () {
        _rootElement.classList.remove('visible');
    }

    _init.call(this);
}

const header = new Header();

export default header;