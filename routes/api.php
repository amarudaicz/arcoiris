<?php

if (isset($router)) {
    $router->get('/api/v1', 'api\Api::info');

    $router->post('/api/v1/auth/users/sign-in', 'api\Auth::userSignIn');
    $router->post('/api/v1/auth/customers/sign-in', 'api\Auth::customerSignIn');
    $router->post('/api/v1/auth/sign-out', 'api\Auth::signOut');

    $router->get('/api/v1/users', 'api\Users::getUsers');
    $router->get('/api/v1/users/profile', 'api\Users::getProfile');
    $router->post('/api/v1/users/profile/email', 'api\Users::updateEmail');
    $router->post('/api/v1/users/profile/password', 'api\Users::updatePassword');

    $router->get('/api/v1/customers', 'api\Customers::getCustomers');
    $router->get('/api/v1/customers/profile', 'api\Customers::getProfile');
    $router->post('/api/v1/customers/profile/password', 'api\Customers::updatePassword');

    $router->get('/api/v1/products', 'api\Products::getProducts');
    $router->post('/api/v1/products/catalog', 'api\Products::uploadFeaturedCatalog');
    $router->post('/api/v1/products/([\w-]+)/image', 'api\Products::updateProductImage');
    $router->post('/api/v1/products/([\w-]+)', 'api\Products::updateProductDetail');

    $router->get('/api/v1/orders', 'api\Orders::getOrders');
    $router->post('/api/v1/orders', 'api\Orders::createOrder');
    $router->get('/api/v1/orders/(\d+)', 'api\Orders::getOrder');
    $router->get('/api/v1/orders/(\d+)/download', 'api\Orders::downloadCSV');

    $router->post('/api/v1/settings/sync', 'api\Settings::sync');

    $router->post('/api/v1/contact', 'api\Contact::createContactMessage');

    $router->set404NotFound('api\Api::error404');
}