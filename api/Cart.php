<?php


namespace api;

use Exception;
use helpers\Logger;
use helpers\Response;
use models\Cart as CartModel;
use models\Session;

abstract class Cart{

    public static function getCart(){

        $customer = Session::getCustomer();

        if (!isset($customer)) {
            http_response_code(401);
            Response::setMessage('No autorizado');
            return;
        }
        
        $cart = CartModel::getCartByCode($customer->getDni(), $customer->getPriceList());
        Response::setData($cart);
    }

    public static function addItem(){
        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);
        
        $customer = Session::getCustomer();
        if (!isset($customer)) {
            http_response_code(401);
            Response::setCode(401);
            Response::setMessage('No autorizado');
            return;
        }

        $success = CartModel::addItem($customer->getDni(), $request->product_code, $request->quantity);
        
        if(!$success){
            http_response_code(400);
            Response::setCode(400);
            Response::setMessage('No se pudo agregar el producto al carrito');
            return;
        }

        $cart = CartModel::getCartByCode($customer->getDni(), $customer->getPriceList());

        if (!$cart->getItems()) {
            http_response_code(400);
            Response::setCode(400);
            Response::setMessage('No se pudo agregar el producto al carrito');
            return;
        }

        Response::setData($cart);
    }



    public static function deleteItem(int $id) {
        $customer = Session::getCustomer();
        
        // Verificar si el cliente está autenticado
        if (!isset($customer)) {
            http_response_code(401);
            Response::setMessage('No autorizado');
            return;
        }
    
        // Llamar al modelo para eliminar el item
        $success = CartModel::deleteItem($id);
        
        if (!$success) {
            http_response_code(400);
            Response::setMessage('No se encontró el item');
            return;
        }

        $cart = CartModel::getCartByCode($customer->getDni(), $customer->getPriceList());
        Response::setData($cart);
    }


    public static function updateItem(){
        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);
        
        $customer = Session::getCustomer();
        if (!isset($customer)) {
            http_response_code(401);
            Response::setCode(401);
            Response::setMessage('No autorizado');
            return;
        }

        $success = CartModel::updateItem($request->id, $request->quantity);
        
        if(!$success){
            http_response_code(400);
            Response::setCode(400);
            Response::setMessage('No se pudo agregar el producto al carrito');
            return;
        }

        $cart = CartModel::getCartByCode($customer->getDni(), $customer->getPriceList());

        if (!$cart->getItems()) {
            http_response_code(400);
            Response::setCode(400);
            Response::setMessage('No se pudo agregar el producto al carrito');
            return;
        }

        Response::setData($cart);
    }

    public static function clearCart() {
        $customer = Session::getCustomer();
        
        // Verificar si el cliente está autenticado
        if (!isset($customer)) {
            http_response_code(401);
            Response::setMessage('No autorizado');
            return;
        }
    
        // Llamar al modelo para eliminar el item
        $success = CartModel::clearCart($customer->getDni());
        
        if (!$success) {
            http_response_code(400);
            Response::setMessage('No se pudo eliminar el item');
            return;
        }

        $cart = CartModel::getCartByCode($customer->getDni(), $customer->getPriceList());
        Response::setData($cart);
    }
    

}
