<?php
namespace models;

use helpers\Logger;

abstract class Session{
    public function __construct(){

    }


    public static function getCustomer(): Customer|User|null {

        $serializedCustomer = $_SESSION['customer'] ?? null;
        $serializedUser = $_SESSION['user'] ?? null;

        return $serializedUser ? unserialize($serializedUser) : ($serializedCustomer ?  unserialize($serializedCustomer) : null);
    }
}