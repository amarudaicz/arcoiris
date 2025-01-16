<?php

namespace api;

use Exception;
use helpers\Logger;
use JsonException;
use helpers\Response;
use models\Connection;
use models\Customer;
use models\CustomerUser;
use models\User;

abstract class Auth {
    /**
     * POST /api/auth/customers/sign-in
     *
     * @return void
     * @throws JsonException
     * @throws Exception
     */
    public static function customerSignIn(): void {
        if (isset($_SESSION['customer'])) {
            throw new Exception('Acción no permitida', 403);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        Connection::getConn()->begin_transaction();

        if (!isset($request->dni)) {
            throw new Exception('DNI required', 400);
        }

        $customer = Customer::getCustomer($request->dni);
        
        if (!$customer) {
            throw new Exception('DNI y/o contraseña incorrectos', 401);
        }

        $customerUser = CustomerUser::getCustomerUser($customer->getDni());

        if (!$customerUser) {
            $customerUser = new CustomerUser();

            $customerUser->setDni($customer->getDni());

            $password = sprintf('arcoirisferretera%d%d', $customer->getZone(), $customer->getNumber());

            $customerUser->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));

            CustomerUser::createCustomerUser($customerUser);
        }   

        if (!password_verify($request->password, $customerUser->getPasswordHash())) {
            throw new Exception('DNI y/o contraseña incorrectos', 401);
        }

        session_regenerate_id(true);

        $_SESSION['customer'] = serialize($customer);
        $_SESSION['user'] = null;


        Connection::getConn()->commit();

        Response::append('profile', $customer);

        Response::setCode(200);
    }

    /**
     * POST /api/auth/user/sign-in
     *
     * @return void
     * @throws JsonException
     * @throws Exception
     */
    public static function userSignIn(): void {
        if (isset($_SESSION['user'])) {
            throw new Exception('Acción no permitida', 403);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        if (!isset($request->email)) {
            throw new Exception('Email requerido', 400);
        }

        if (filter_var($request->email, FILTER_VALIDATE_EMAIL) === false) {
            throw new Exception('Formato de email invalido', 400);
        }

        $user = User::getUserByEmail($request->email);

        if (!$user) {
            throw new Exception('Email y/o contraseña incorrectos', 401);
        }

        if (!password_verify($request->password, $user->getPasswordHash())) {
            throw new Exception('Email y/o contraseña incorrectos', 401);
        }

        session_regenerate_id(true);

        $_SESSION['user'] = serialize($user);
        $_SESSION['customer'] = null;

        Response::setCode(200);
    }

    /**
     * POST /api/auth/sign-out
     *
     * @return void
     */
    public static function signOut(): void {
        $_SESSION = [];

        session_regenerate_id(true);

        session_destroy();

        Response::setCode(200);
    }
}