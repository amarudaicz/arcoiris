<?php

namespace api;

use helpers\Response;

abstract class Api {
    /**
     * GET /api/v1
     *
     * @return void
     * @see SecurityMiddleware::checkIpAddress
     */
    public static function info(): void {
        $parsedFile = yaml_parse_file('OpenAPI.yaml');

        Response::append('info', $parsedFile);

        Response::setMessage('Welcome to the API interface');

        Response::setCode(200);
    }

    /**
     * Error 404 - Endpoint not found
     *
     * @return void
     */
    public static function error404(): void {
        Response::setCode(404);
        Response::setMessage('The requested endpoint could not be found on the server. Please check the URL and try again. If you believe this to be an error, please contact the server administrator');
    }
}