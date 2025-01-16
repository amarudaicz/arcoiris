function ShoppingCartState() {
    let _cart = _getCartObject();

    function _init() {
        _loadCart();
    }

    function _loadCart() {
        const strCart = localStorage.getItem('cart');

        if (strCart) {
            _cart = JSON.parse(strCart); 
        } else {
            _cart = _getCartObject()

            _saveCart();
        }
    }

    function _saveCart() {
        localStorage.setItem('cart', JSON.stringify(_cart));
    }

    function _getCartObject() {
        return {
            index: 1,
            items: []
        };
    }

    this.length = function () {
        return _cart.items.length;
    }

    this.getTotal = function () {
        let total = 0;

        _cart.items.forEach(item => {
            total += item.quantity * item.price;
        });

        return total;
    }

    this.getItems = function () {
        return _cart.items;
    }

    this.getFormattedItems = function () {
        const formattedItems = [];

        _cart.items.forEach(item => {
            formattedItems.push({
                productCode: item.productCode,
                quantity: item.quantity
            });
        });

        return formattedItems;
    }

    this.addItem = function (item) {
        item.index = _cart.index++;

        _cart.items.push(item);

        _saveCart();
    }

    this.deleteItem = function (item) {
        _cart.items = _cart.items.filter(_item => {
            return _item.index !== item.index;
        });

        _saveCart();
    }

    this.clearCart = function () {
        localStorage.removeItem('cart');
        _loadCart();
    }

    this.saveCart = _saveCart;

    _init.call(this);
}

export const shoppingCartState = new ShoppingCartState();
