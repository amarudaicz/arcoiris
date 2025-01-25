<?php

namespace helpers;

/**
 *
 */
abstract class Response {
    /**
     * @var int
     */
    private static int $code = 0;

    /**
     * @var mixed|null
     */
    private static mixed $data = null;

    /**
     * @var string
     */
    private static string $message = '';

    /**
     *
     */
    private function __construct() {}

    /**
     * @param int $code
     *
     * @return void
     */
    public static function setCode(int $code): void {
        self::$code = $code;
    }

    /**
     * @param mixed $data
     *
     * @return void
     */
    public static function setData(mixed $data): void {
        self::$data = $data;
    }

    /**
     * @param string $message
     *
     * @return void
     */
    public static function setMessage(string $message): void {
        self::$message = $message;
    }

    /**
     * @param int    $code
     * @param string $msg
     *
     * @return void
     */
    public static function set(int $code, string $msg): void {
        self::$code = $code;
        self::$message = $msg;
    }

    /**
     * @param string $key
     * @param mixed  $value
     *
     * @return void
     */
    public static function append(string $key, mixed $value): void {
        if (!self::$data) {
            self::$data = [];
        }

        self::$data[$key] = $value;
    }

    /**
     * @return void
     */
    public static function send(): void {
        header('Content-Type: application/json');
        
        echo json_encode([
            "code" => self::$code,
            "data" => self::$data,
            "message" => self::$message,
        ]);
    }


}