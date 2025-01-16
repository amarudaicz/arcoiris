import "/public/node_modules/sweetalert2/dist/sweetalert2.min.js";

import moduleLoader from "/public/components/module-loader/ModuleLoader.js";
import "/public/components/admin-header/Header.js";
import "/public/components/admin-nav/AdminNav.js";
import "/public/components/user-nav/UserNav.js";

moduleLoader.addModule({
    'pattern': '/admin',
    'script': '/public/components/order-list/OrderList.js',
    'style': '/public/components/order-list/OrderList.css'
});

moduleLoader.addModule({
    'pattern': '/admin/profile',
    'script': '/public/components/admin-profile/AdminProfile.js',
    'style': '/public/components/admin-profile/AdminProfile.css'
});

moduleLoader.addModule({
    'pattern': '/admin/profile/password',
    'script': '/public/components/admin-password-update/AdminPasswordUpdate.js',
    'style': '/public/components/admin-password-update/AdminPasswordUpdate.css'
});

moduleLoader.addModule({
    'pattern': '/admin/profile/email',
    'script': '/public/components/admin-email-update/AdminEmailUpdate.js',
    'style': '/public/components/admin-email-update/AdminEmailUpdate.css'
});

moduleLoader.addModule({
    'pattern': '/admin/products',
    'script': '/public/components/product-list/ProductList.js',
    'style': '/public/components/product-list/ProductList.css'
});

moduleLoader.addModule({
    'pattern': '/admin/images',
    'script': '/public/components/image-list/ImageList.js',
    'style': '/public/components/image-list/ImageList.css'
});

moduleLoader.addModule({
    'pattern': '/admin/customers',
    'script': '/public/components/customer-list/CustomerList.js',
    'style': '/public/components/customer-list/CustomerList.css'
});

moduleLoader.addModule({
    'pattern': '/admin/orders',
    'script': '/public/components/order-list/OrderList.js',
    'style': '/public/components/order-list/OrderList.css'
});

moduleLoader.addModule({
    'pattern': '/admin/orders/(\\d+)',
    'script': '/public/components/order-view/OrderView.js',
    'style': '/public/components/order-view/OrderView.css'
});

moduleLoader.addModule({
    'pattern': '/admin/users',
    'script': '/public/components/user-list/UserList.js',
    'style': '/public/components/user-list/UserList.css'
});

moduleLoader.run();