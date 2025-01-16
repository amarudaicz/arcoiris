import {checkoutSuccessModal} from "/public/components/checkout-success-modal/CheckoutSuccessModal.js";
import {siteHeader} from "/public/components/site-header/SiteHeader.js";
import {SwtError, SwtInfo} from "/public/components/util/BoxMessage.js";
import {currencyFormat} from "/public/components/util/Util.js";
import {appState} from "/public/components/util/AppState.js";

function ShoppingCart() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _formElement = _rootElement.querySelector('[data-js="form"]');
    const _entriesElement = _rootElement.querySelector('[data-js="entries"]');
    const _checkoutButtonElement = _rootElement.querySelector('[data-js="checkout-button"]');
    const _cartTotalElement = _checkoutButtonElement.querySelector('[data-js="cart-total"]');
    const _cartQuantityElement = _rootElement.querySelector('[data-js="cart-quantity"]');

    let isSubmitting = false;

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        appState.subscribe(_processCartState);

        _formElement.onsubmit = _onSubmitShoppingCart.bind(_formElement);
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="ShoppingCart"]');

        element.className = 'ShoppingCart empty';

        element.innerHTML = `<h2 class="mb-3">
    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" x="0px" y="0px" class="me-2" width="35" height="35" viewBox="0 0 122.9 107.5" xml:space="preserve">
        <g>
            <path fill="#4c4c4c" d="M3.9,7.9C1.8,7.9,0,6.1,0,3.9C0,1.8,1.8,0,3.9,0h10.2c0.1,0,0.3,0,0.4,0c3.6,0.1,6.8,0.8,9.5,2.5c3,1.9,5.2,4.8,6.4,9.1 c0,0.1,0,0.2,0.1,0.3l1,4H119c2.2,0,3.9,1.8,3.9,3.9c0,0.4-0.1,0.8-0.2,1.2l-10.2,41.1c-0.4,1.8-2,3-3.8,3v0H44.7 c1.4,5.2,2.8,8,4.7,9.3c2.3,1.5,6.3,1.6,13,1.5h0.1v0h45.2c2.2,0,3.9,1.8,3.9,3.9c0,2.2-1.8,3.9-3.9,3.9H62.5v0 c-8.3,0.1-13.4-0.1-17.5-2.8c-4.2-2.8-6.4-7.6-8.6-16.3l0,0L23,13.9c0-0.1,0-0.1-0.1-0.2c-0.6-2.2-1.6-3.7-3-4.5 c-1.4-0.9-3.3-1.3-5.5-1.3c-0.1,0-0.2,0-0.3,0H3.9L3.9,7.9z M96,88.3c5.3,0,9.6,4.3,9.6,9.6c0,5.3-4.3,9.6-9.6,9.6 c-5.3,0-9.6-4.3-9.6-9.6C86.4,92.6,90.7,88.3,96,88.3L96,88.3z M53.9,88.3c5.3,0,9.6,4.3,9.6,9.6c0,5.3-4.3,9.6-9.6,9.6 c-5.3,0-9.6-4.3-9.6-9.6C44.3,92.6,48.6,88.3,53.9,88.3L53.9,88.3z M33.7,23.7l8.9,33.5h63.1l8.3-33.5H33.7L33.7,23.7z"/>
        </g>
    </svg>
    <span>Carrito de compras</span>
</h2>
<p class="text-muted mb-1" data-js="cart-quantity"></p>
<div class="row g-4">
    <div class="col-lg-9">
        <div class="empty-view"></div>
        <table class="cart-items custom-table">
            <thead>
            <tr>
                <th>Item</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th></th>
            </tr>
            </thead>
            <tbody class="entries" data-js="entries">
            <!---entries--->
            </tbody>
        </table>
    </div>
    <div class="col-lg-3">
        <div class="cart-detail">
            <form data-js="form">
                <div class="mb-3">
                    <label for="paymentMethod">Forma de pago</label>
                    <input id="paymentMethod" type="text" class="form-control p-2" name="paymentMethod" placeholder="Efectivo, Transferencia bancaria, etc." maxlength="50">
                </div>
                <div class="mb-4">
                    <label for="note">Observaciones</label>
                    <textarea id="note" class="form-control p-2" name="note" maxlength="200" placeholder=""></textarea>
                </div>
                <button disabled class="checkout-button" data-js="checkout-button" type="submit" name="checkout-button">
                    <div class="row g-2">
                        <div class="col fw-bold text-start" data-js="cart-total">
                            $ 0.00
                        </div>
                        <div class="col-auto text-end">Finalizar</div>
                        <div class="col-auto text-end">
                            <span class="spinner-border spinner-border-sm d-none"></span>
                            <span class="bi-chevron-right"></span>
                        </div>
                    </div>
                </button>
            </form>
        </div>
    </div>
</div>`;

        return element;
    }

    function _createItemElement(item) {
        const element = document.createElement('tr');

        element.className = "";

        element.innerHTML = `<td class="d-flex">
        <img class="item-image me-3" src="/${item.image}" alt="Imagen que representa al producto en la fila del carrito de compras">
        <div class="">
            <p class="mb-1 text-start text-sm-start">${item.description}</p>
            <p class="mb-0 small text-start text-sm-start text-muted">COD. <b>${item.productCode.toString()}</b></p>
        </div>
    </td>
    <td data-colname="Precio" class="text-end text-sm-center">
        <span class="item-price">${currencyFormat(item.price)}</span>
    </td>
    <td data-colname="Cantidad" class="text-end text-sm-center">
        <input type="number" data-js="item-quantity" class="text-center quantity-input d-inline-block form-control p-2" step="1" name="item-quantity-input" value="${item.quantity}" required min="1">
    </td>
    <td data-colname="Total" class="text-end text-sm-center item-total" data-js="item-total">${currencyFormat(item.total)}</td>
    <td data-colname="Accion" class="text-end text-sm-center">
        <button type="button" name="delete-item" data-js="delete-item" class="btn btn-danger btn-sm"><i class="bi-trash3-fill"></i></button>
    </td>`;

        const itemQuantity = element.querySelector('[data-js="item-quantity"]');
        const deleteButton = element.querySelector('[data-js="delete-item"]');

        itemQuantity.oninput = _onChangeItemQuantity.bind(itemQuantity, element, item);
        deleteButton.onclick = _onDeleteItem.bind(deleteButton, element, item);

        return element;
    }

    function _processCartState() {
        const cartItems = appState.getState().cart ?? [];

        let cartTotal = 0;

        _entriesElement.innerHTML = "";

        cartItems.forEach(item => {
            cartTotal += item.total = item.price * item.quantity;

            _entriesElement.append(_createItemElement(item));
        });
 
        _cartTotalElement.textContent = currencyFormat(cartTotal);

        _cartQuantityElement.innerHTML = `Tienes <b>${cartItems.length}</b> items en tu carrito.`;

        if (cartItems.length > 0) {
            _showLoadedView();
        } else {
            _showEmptyView();
            _disableCheckoutButton();
            if (!appState.getState().customer) {
                SwtInfo.fire({title: 'Debe iniciar sesión para poder comprar'}).then();
            }
        }

        if (cartItems.length > 0 && appState.getState().customer) {
            _enableCheckoutButton();
        }
    }

    function _showLoadedView() {
        _rootElement.classList.remove('empty');
        _rootElement.classList.add('loaded');
    }

    function _showEmptyView() {
        _rootElement.classList.add('empty');
        _rootElement.classList.remove('loaded');
    }

    function _enableCheckoutButton() {
        _checkoutButtonElement.disabled = false;
        _checkoutButtonElement.children[0].lastElementChild.children[0].classList.add('d-none');
        _checkoutButtonElement.children[0].lastElementChild.children[1].classList.remove('d-none');
    }

    function _showLoadingCheckoutButton() {
        _checkoutButtonElement.disabled = true;
        _checkoutButtonElement.children[0].lastElementChild.children[0].classList.remove('d-none');
        _checkoutButtonElement.children[0].lastElementChild.children[1].classList.add('d-none');
    }

    function _disableCheckoutButton() {
        _checkoutButtonElement.disabled = true;
        _checkoutButtonElement.children[0].lastElementChild.children[0].classList.add('d-none');
        _checkoutButtonElement.children[0].lastElementChild.children[1].classList.add('d-none');
    }

    function _onDeleteItem(element, item) {
        if (isSubmitting) return;

        appState.getState().cart = appState.getState().cart.filter(_item => {
            return _item !== item;
        });

        appState.saveState();

        appState.notifyAll();
    }

    function _onChangeItemQuantity(element, item) {
        if (isSubmitting) return;

        item.quantity = parseInt(this.value);

        item.total = item.price * item.quantity;

        element.querySelector('[data-js="item-total"]').textContent = currencyFormat(item.total);

        let cartTotal = 0;

        appState.getState().cart.forEach(item => {
            cartTotal += item.price * item.quantity;
        });

        _cartTotalElement.textContent = currencyFormat(cartTotal);

        appState.saveState();
    }

    function _onSubmitShoppingCart(event) {
        event.preventDefault();

        if (isSubmitting) return false;

        isSubmitting = true;

        _showLoadingCheckoutButton();

        const data = {
            paymentMethod: _formElement['paymentMethod'].value,
            note: _formElement['note'].value,
            items: []
        };

        if (appState.getState().cart) {
            appState.getState().cart.forEach(item => {
                data.items.push({
                    productCode: item.productCode,
                    quantity: item.quantity
                })
            });
        }

        setTimeout(() => {
            fetch('/api/v1/orders', {
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(resp => {
                    _enableCheckoutButton();

                    isSubmitting = false;

                    if (resp.code === 200) {
                        checkoutSuccessModal.setOrderId(resp.data['orderId']);
                        checkoutSuccessModal.show();
                        siteHeader.clearCartCount();
                        appState.getState().cart = [];
                        appState.saveState();
                        appState.notifyAll();
                        _formElement.reset();
                        return;
                    }

                    if (resp.code === 401) {
                        appState.getState().customer = null;
                        appState.notifyAll();
                        appState.saveState();
                        SwtInfo.fire({title: 'Debe iniciar sesión para poder continuar'}).then();
                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    _enableCheckoutButton();

                    isSubmitting = false;

                    SwtError.fire({title: reason}).then();
                });
        }, 400);

        return false;
    }

    _init.call(_self);
}

export const shoppingCart = new ShoppingCart();