<?php

namespace config;

/**
 * DatabaseConfiguration is an abstract class that provides constant attributes for database configuration.
 */
abstract class DatabaseConfiguration {
    /**
     * The host name or IP address of the database server.
     */
    public const DB_HOST = 'localhost';

    /**
     * The port number on which the database server is listening.
     */
    public const DB_PORT = 3306;

    /**
     * The username used for connecting to the database.
     */
    public const DB_USERNAME = 'u918235402_arcoirisferre';
    // public const DB_USERNAME = 'root';

    /**
     * The password used for connecting to the database.
     */
    public const DB_PASSWORD = 'FhE71Uiyw/2';
    // public const DB_PASSWORD = '';

    /**
     * The name of the database to connect to.
     */
    public const DB_NAME = 'u918235402_arcoirisferre';
    // public const DB_NAME = 'ferreteria_arcoiris';
}

