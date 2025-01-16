<?php

namespace api;

use Exception;
use helpers\Response;
use models\Customer;
use models\CustomerUser;

/**
 *
 */
abstract class Customers {
    /**
     * @return void
     * @throws Exception
     */
    public static function getCustomers(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        Response::append('customers', Customer::getCustomers());

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     */
    public static function getProfile(): void {
        if (!isset($_SESSION['customer'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        Response::append('profile', unserialize($_SESSION['customer']));

        Response::setCode(200);

    }

    /**
     * @return void
     * @throws Exception
     */
    public static function updatePassword(): void {
        if (!isset($_SESSION['customer'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        $customer = unserialize($_SESSION['customer']);

        $customerUser = CustomerUser::getCustomerUser($customer->getDni());

        if (!password_verify($request->password, $customerUser->getPasswordHash())) {
            throw new Exception('La contraseña actual no es correcta', 401);
        }

        if ($request->newPassword !== $request->repeatNewPassword) {
            throw new Exception('Las contraseñas nuevas deben coincidir', 400);
        }

        if (strlen($request->newPassword) < 8) {
            throw new Exception('La contraseña nueva tiene que ser de al menos 8 dígitos o más');
        }

        $customerUser->setPasswordHash(password_hash($request->newPassword, PASSWORD_DEFAULT));

        CustomerUser::updateCustomerUser($customerUser);

        $_SESSION['customer'] = serialize($customer);

        Response::setCode(200);
    }
}