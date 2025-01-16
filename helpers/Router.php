<?php

namespace helpers;

use Exception;

/**
 *
 */
class Router {
    /**
     * @var array
     */
    private array $routes;

    /**
     * @var mixed|string
     */
    private mixed $notFoundController;

    /**
     *
     */
    public function __construct() {
        $this->routes = [];
        $this->notFoundController = '';
    }

    /**
     * @param string     $method
     * @param string     $pattern
     * @param callable   $controller
     * @param array|null $before
     * @param array|null $after
     *
     * @return void
     */
    private function add(string $method, string $pattern, callable $controller, ?array $before = null, ?array $after = null): void {
        if (!isset($this->routes[$pattern])) {
            $this->routes[$pattern] = [];
        }

        $this->routes[$pattern][$method] = [
            'method' => $method,
            'pattern' => $pattern,
            'controller' => $controller,
            'before' => $before,
            'after' => $after
        ];

    }

    /**
     * @param string   $type
     * @param string   $method
     * @param string   $pattern
     * @param callable $controller
     *
     * @return void
     */
    private function addMiddleware(string $type, string $method, string $pattern, callable $controller): void {
        if (!isset($this->routes[$pattern])) return;

        if (!isset($this->routes[$pattern][$method])) return;

        if ($type === 'before') {
            $this->routes[$pattern][$method]['before'][] = $controller;
        } else {
            $this->routes[$pattern][$method]['after'][] = $controller;
        }
    }

    /**
     * @param string     $pattern
     * @param callable   $controller
     * @param array|null $before
     * @param array|null $after
     *
     * @return void
     * @see self::add()
     */
    public function get(string $pattern, callable $controller, ?array $before = null, ?array $after = null): void {
        $this->add('GET', $pattern, $controller, $before, $after);
    }

    /**
     * @param string     $pattern
     * @param callable   $controller
     * @param array|null $before
     * @param array|null $after
     *
     * @return void
     * @see self::add()
     */
    public function post(string $pattern, callable $controller, ?array $before = null, ?array $after = null): void {
        $this->add('POST', $pattern, $controller, $before, $after);
    }

    /**
     * @param string     $pattern
     * @param callable   $controller
     * @param array|null $before
     * @param array|null $after
     *
     * @return void
     * @see self::add()
     */
    public function put(string $pattern, callable $controller, ?array $before = null, ?array $after = null): void {
        $this->add('PUT', $pattern, $controller, $before, $after);
    }

    /**
     * @param string     $pattern
     * @param callable   $controller
     * @param array|null $before
     * @param array|null $after
     *
     * @return void
     * @see self::add()
     */
    public function delete(string $pattern, callable $controller, ?array $before = null, ?array $after = null): void {
        $this->add('DELETE', $pattern, $controller, $before, $after);
    }

    /**
     * @param string   $method
     * @param string   $pattern
     * @param callable $controller
     *
     * @return void
     */
    public function before(string $method, string $pattern, callable $controller): void {
        $this->addMiddleware('before', $method, $pattern, $controller);
    }

    /**
     * @param string   $method
     * @param string   $pattern
     * @param callable $controller
     *
     * @return void
     * @throws Exception
     */
    public function after(string $method, string $pattern, callable $controller): void {
        $this->addMiddleware('after', $method, $pattern, $controller);
    }

    /**
     * @param callable $controller
     *
     * @return void
     */
    public function set404NotFound(callable $controller): void {
        $this->notFoundController = $controller;
    }

    /**
     * @return void
     * @throws Exception
     */
    public function run(): void {
        $requestPath = parse_url($_SERVER['REQUEST_URI'])['path'];

        if ($requestPath !== '/') {
            $requestPath = rtrim($requestPath, '/');
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        $matches = [];

        $foundRoute = null;

        foreach ($this->routes as $pattern => $methods) {
            if (!preg_match('#^' . $pattern . '$#', $requestPath, $matches))
                continue;

            if (isset($methods[$requestMethod]))
                $foundRoute = $methods[$requestMethod];

            break;
        }

        if (!$foundRoute) {
            if (is_callable($this->notFoundController)) {
                call_user_func($this->notFoundController);
                return;
            } else throw new Exception('The route does not exist', 404);
        }

        $matches = array_slice($matches, 1);

        if (!is_callable($foundRoute['controller'])) {
            throw new Exception('Either the class or method does not exist', 404);
        }

        //Call before handlers
        if (isset($foundRoute['before']) && is_array($foundRoute['before'])) {
            foreach ($foundRoute['before'] as $before) {
                if (is_callable($before)) {
                    if (!call_user_func_array($before, $matches)) return;
                }
            }
        }

        //Call controller
        call_user_func_array($foundRoute['controller'], $matches);

        //Call after handlers
        if (isset($foundRoute['after']) && is_array($foundRoute['after'])) {
            foreach ($foundRoute['after'] as $after) {
                if (is_callable($after)) {
                    if (!call_user_func_array($after, $matches)) return;
                }
            }
        }
    }
}