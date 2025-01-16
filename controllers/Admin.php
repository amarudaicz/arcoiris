<?php

namespace controllers;

/**
 *
 */
abstract class Admin {
    /**
     * @return void
     */
    public static function index(): void {
        if (!isset($_SESSION['user'])) {
            header('Location: /admin/sign-in', true, 302);
            return;
        }

        echo file_get_contents('public/pages/admin/admin.html');
    }

    /**
     * @return void
     */
    public static function signIn(): void {
        if (isset($_SESSION['user'])) {
            header('Location: /admin', true, 302);
            return;
        }

        echo file_get_contents('public/pages/sign-in/sign-in.html');
    }

    /**
     * @return void
     */
    public static function signOut(): void {
        $_SESSION=[];

        session_destroy();

        header('Location: /admin/sign-in', true, 302);
    }
}
