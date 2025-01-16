<?php

namespace api;

use Exception;
use helpers\Response;
use models\User;

/**
 *
 */
abstract class Users {
    /**
     * @return void
     * @throws Exception
     */
    public static function getUsers(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        Response::append('users', User::getUsers());

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     */
    public static function getProfile(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        Response::append('profile', unserialize($_SESSION['user']));

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     */
    public static function updateEmail(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        $user = unserialize($_SESSION['user']);

        if (!isset($request->newEmail) || !isset($request->repeatNewEmail)) {
            throw new Exception('Email requerido', 400);
        }

        if (!filter_var($request->newEmail, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email invalido', 400);
        }

        if (!filter_var($request->repeatNewEmail, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email invalido', 400);
        }

        if ($request->newEmail !== $request->repeatNewEmail) {
            throw new Exception('Los emails deben coincidir', 400);
        }

        if (User::getUserByEmail($request->newEmail)) {
            throw new Exception('El email ya existe', 400);
        }

        $user->setEmail($request->newEmail);

        User::updateUser($user);

        $_SESSION['user'] = serialize($user);

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     */
    public static function updatePassword(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        $user = unserialize($_SESSION['user']);

        if (!password_verify($request->password, $user->getPasswordHash())) {
            throw new Exception('La contraseña actual no es correcta', 401);
        }

        if ($request->newPassword !== $request->repeatNewPassword) {
            throw new Exception('Las contraseñas nuevas deben coincidir', 400);
        }

        if (strlen($request->newPassword) < 8) {
            throw new Exception('La contraseña nueva tiene que ser de al menos 8 dígitos o más');
        }

        $user->setPasswordHash(password_hash($request->newPassword, PASSWORD_DEFAULT));

        User::updateUser($user);

        $_SESSION['user'] = serialize($user);

        Response::setCode(200);
    }
}