<?php

namespace models;

use mysqli;
use config\DatabaseConfiguration;

/**
 * Connection is an abstract class that provides a connection to the database using the mysqli extension.
 */
abstract class Connection {
    /**
     * @var mysqli|null The mysqli connection object.
     */
    private static mysqli|null $conn = null;

    /**
     * The private constructor prevents creating an instance of the Connection class.
     */
    private function __construct() {}

    /**
     * Returns the mysqli connection object.
     *
     * @return mysqli The mysqli connection object.
     */
    public static function getConn(): mysqli {
        if (!self::$conn) {
            self::$conn = new mysqli(
                DatabaseConfiguration::DB_HOST,
                DatabaseConfiguration::DB_USERNAME,
                DatabaseConfiguration::DB_PASSWORD,
                DatabaseConfiguration::DB_NAME,
                DatabaseConfiguration::DB_PORT
            );

            mysqli_report(MYSQLI_REPORT_STRICT | MYSQLI_REPORT_ERROR);

            self::$conn->set_charset('UTF8');
        }

        return self::$conn;
    }
}
