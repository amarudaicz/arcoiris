import {appState} from "/public/components/util/AppState.js";

function SiteHeader() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _navButton = _rootElement.querySelector('[data-js="nav-button"]');
    const _cartButton = _rootElement.querySelector('[data-js="cart-button"]');
    let _lastScrollY = 0;

    function _init() {
        _setupEventListeners();
    }

    function _updateCartButtonText() {
        const cartState = appState.getState().cart;

        if (cartState) {
            const cartCount = cartState.length;
            _cartButton.children[1].textContent = cartCount.toString();
        }
    }

    function _setupEventListeners() {
        appState.subscribe(_updateCartButtonText);

        window.addEventListener('click', (event) => {
            if (_rootElement.classList.contains('nav-visible')) {
                _rootElement.classList.remove('nav-visible');
            }
        });

        _rootElement.addEventListener('click', (event) => {
            let target = event.target;

            while (target) {
                if (target.nodeName === 'A') {
                    return;
                }

                target = target.parentElement;
            }

            event.cancelBubble = true;
        });

        _navButton.onclick = _onClickNavButton;

        window.addEventListener('scroll', _autoHideHeader);
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="SiteHeader"]');

        element.className = "SiteHeader";

        element.innerHTML = `
    <div class="center">
        <div>
            <img class="header-logo" src="/public/images/logo-small.png" alt="Logo empresa">
        </div>
        <nav>
            <div class="row g-3 align-items-center">
                <div class="col-auto">
                    <ul class="">
                        <li><a href="/#">Inicio</a></li>
                        <li><a href="/products">Productos</a></li>
                        <li><a class="featured" href="/products/featured">Destacados</a></li>
                        <li><a href="/#about-us">Nosotros</a></li>
                        <li><a href="/#services">Servicios</a></li>
                        <li><a href="/#contact">Contacto</a></li>
                    </ul>
                </div>
                <div class="col-auto">
                    <a href="/shopping-cart" class="btn cart-button" data-js="cart-button">
                        <span class="h4 bi-cart-fill"></span>
                        <span class="badge text-bg-warning cart-count">0</span>
                    </a>
                </div>
                <div class="col-auto nav-button-col">
                    <button type="button" class="btn nav-button" data-js="nav-button">
                        <i class="h4 bi-list"></i>
                    </button>
                </div>
            </div>
        </nav>
    </div>`;

        return element;
    }

    function _onClickNavButton(event) {
        event.cancelBubble = true;
        if (_rootElement.classList.contains('nav-visible')) {
            _rootElement.classList.remove('nav-visible');
        } else {
            _rootElement.classList.add('nav-visible');
        }
    }

    function _autoHideHeader() {
        if (window.scrollY < 200) {
            _rootElement.classList.remove('hide');
            return
        }

        if (window.scrollY - _lastScrollY > 0) {
            _rootElement.classList.add('hide');
        } else {
            _rootElement.classList.remove('hide');
        }

        _lastScrollY = window.scrollY;
    }

    this.addCartCount = function () {
        const count = parseInt(_cartButton.children[1].textContent);

        _cartButton.classList.add('run');

        _cartButton.onanimationend = function (event) {
            _cartButton.classList.remove('run');
        }

        _cartButton.children[1].textContent = (count + 1).toString();
    }

    this.subtractCartCount = function () {
        const count = parseInt(_cartButton.children[1].textContent);

        if (count <= 0) return;

        _cartButton.classList.add('run');

        _cartButton.onanimationend = function (event) {
            _cartButton.classList.remove('run');
        }

        _cartButton.children[1].textContent = (count - 1).toString();
    }

    this.clearCartCount = function () {
        _cartButton.classList.add('run');

        _cartButton.onanimationend = function (event) {
            _cartButton.classList.remove('run');
        }

        _cartButton.children[1].textContent = '0';
    }

    _init.call(_self);
}

export const siteHeader = new SiteHeader();
