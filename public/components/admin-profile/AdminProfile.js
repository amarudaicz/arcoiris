import {adminNav} from "/public/components/admin-nav/AdminNav.js";
import {userProfile} from "/public/components/util/UserProfile.js";

function AdminProfile() {
    const _rootElement = _createRootElement();
    const _usernameElement = _rootElement.querySelector('[data-js="username"]');

    function _init() {
        userProfile.getProfile().then(data => {
            _usernameElement.textContent = data.profile.name;
        });
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = "AdminProfile";

        div.innerHTML = `<div class="profile-image"></div>
<div class="text-center h4">
    Bienvenido, <span class="fw-bold" data-js="username"><!----></span>
</div>
<p class="text-center mb-5">Administrá la configuración de tu cuenta desde esta sección</p>
<div class="row row-cols-1 row-cols-md-2 g-4 mb-4">
    <div class="col-md">
        <div class="option-box">
            <div class="box-content">
                <div class="row">
                    <div class="col">
                        <h4 class="fw-lighter mb-3">Cambiar email</h4>
                        <p>Podes cambiar el email que estás usando por otro en cualquier momento</p>
                    </div>
                    <div class="col-auto">
                        <img src="/public/images/email.png" alt="Icono de un sobre representando a un email">
                    </div>
                </div>
            </div>
            <div class="box-footer">
                <a href="/admin/profile/email" data-js="module-link">
                    <div class="row">
                        <div class="col text-start">
                            Cambiar email
                        </div>
                        <div class="col-auto">
                            <i class="bi-chevron-right"></i>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <div class="col-md">
        <div class="option-box">
            <div class="box-content">
                <div class="row">
                    <div class="col">
                        <h4 class="fw-lighter mb-3">Cambiar contraseña</h4>
                        <p>Cambia tu contraseña por una nueva de forma periódica y evita robos.</p>
                    </div>
                    <div class="col-auto">
                        <img src="/public/images/change-password.svg" alt="Icono de una llave representando a una contraseña">
                    </div>
                </div>
            </div>
            <div class="box-footer">
                <a href="/admin/profile/password" data-js="module-link">
                    <div class="row">
                        <div class="col text-start">
                            Cambiar contraseña
                        </div>
                        <div class="col-auto">
                            <i class="bi-chevron-right"></i>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>`;

        return div;
    }

    this.getRoot = function () {
        return _rootElement;
    }

    this.onFocus = function () {
        adminNav.select(null);
    }

    _init.call(this);
}

const profile = new AdminProfile();

export default profile;