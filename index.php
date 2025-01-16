<?php

use helpers\Router;
use controllers\Home;

include_once("vendor/autoload.php");
include_once("config/config.php");

try {
    session_start();

    $router = new Router();

    include_once("routes/web.php");

    $router->run();
} catch (Throwable $e) {
    Home::error500();
}
