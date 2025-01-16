<?php

use helpers\Router;
use helpers\Response;

include_once("vendor/autoload.php");
include_once("config/config.php");

try {
    session_start();

    $router = new Router();

    include_once("routes/api.php");

    $router->run();
} catch (Throwable $e) {
    Response::setCode($e->getCode());
    Response::setMessage($e->getMessage());
    Response::setData(null);
    Response::append('debug', $e->getTraceAsString());
}

Response::send();