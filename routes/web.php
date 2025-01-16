<?php
 
if (isset($router)) {
    $router->get('/', 'controllers\Home::home');

    $router->get('/products', 'controllers\Home::products');
    $router->get('/products/download/xml', 'controllers\Home::downloadXMLProductFile');
    $router->get('/products/download/pdf', 'controllers\Home::downloadPDFProductFile');
    $router->get('/products/featured', 'controllers\Home::featuredProducts');
    $router->get('/products/featured/download/xml', 'controllers\Home::downloadXMLFeaturedProductFile');
    $router->get('/products/featured/download/pdf', 'controllers\Home::downloadPDFFeaturedProductFile');
    $router->get('/shopping-cart', 'controllers\Home::shoppingCart');
    $router->get('/terms-and-policy', 'controllers\Home::termsAndPolicy');

    $router->get('/sign-out', 'controllers\Home::signOut');
    $router->get('/profile/password', 'controllers\Home::customerPasswordUpdate');

    $router->get('/admin', 'controllers\Admin::index');
    $router->get('/admin/sign-in', 'controllers\Admin::signIn');
    $router->get('/admin/sign-out', 'controllers\Admin::signOut');
    $router->get('/admin/profile', 'controllers\Admin::index');
    $router->get('/admin/profile/email', 'controllers\Admin::index');
    $router->get('/admin/profile/password', 'controllers\Admin::index');
    $router->get('/admin/products', 'controllers\Admin::index');
    $router->get('/admin/customers', 'controllers\Admin::index');
    $router->get('/admin/orders', 'controllers\Admin::index');
    $router->get('/admin/orders/(\d+)', 'controllers\Admin::index');
    $router->get('/admin/users', 'controllers\Admin::index');


    $router->set404NotFound('controllers\Home::error404');
}