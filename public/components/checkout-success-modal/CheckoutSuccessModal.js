import {appState} from "/public/components/util/AppState.js";

function CheckoutSuccessModal() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _closeButton = _rootElement.querySelector('[data-js="close-button"]');
    const _orderNumberElement = _rootElement.querySelector('[data-js="order-id"]');
    const _customerNameElement = _rootElement.querySelector('[data-js="customer-name"]');

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        _rootElement.onclick = function (event) {
            if (_rootElement === event.target) {
                _self.hide();
            }
        }

        _closeButton.onclick = _self.hide;
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="checkoutSuccessModal"]');

        element.className = "CheckoutSuccessModal";

        element.innerHTML = `<div class="content">
    <div class="header">
        
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_16_5285)">
                <path d="M7 12L12 17L22 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L7 17M12 12L17 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_16_5285">
                    <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    </div>
    <div class="body">
        <p class="h3 mb-4 text-center">MUCHAS GRACIAS!</p>
        <p class="text-center fw-bold mb-1" data-js="customer-name"></p>
        <p class="text-muted text-center mb-5">
            Tu solicitud se registro con el numero <span class="fw-bold" data-js="order-id">#000</span>.<br>
            Nos pondremos en contacto contigo a la brevedad.
        </p>
        <div class="text-center">
            <button type="button" name="close-button" class="close-button" data-js="close-button">Aceptar</button>
        </div>
    </div>
</div>`;

        return element;
    }

    this.setOrderId = function (orderId) {
        _orderNumberElement.textContent = `#${orderId.toString().padStart(5, '0')}`;

        if (appState.getState().customer)
            _customerNameElement.textContent = appState.getState().customer.name;
        else
            _customerNameElement.textContent = 'Unknown customer';
    }

    this.show = function () {
        _rootElement.classList.add('animated');
        _rootElement.classList.add('visible');
        document.documentElement.classList.add('no-scroll');
    }

    this.hide = function () {
        _rootElement.classList.remove('visible');
        document.documentElement.classList.remove('no-scroll');
    }

    _init.call(_self);
}

export const checkoutSuccessModal = new CheckoutSuccessModal();