function SiteFooter() {
    const _rootElement = _createRootElement();

    function _init() {
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="SiteFooter"]');

        element.className = "SiteFooter";

        element.innerHTML = `<div class="main-bar">
    <div class="content">
        <div class="row g-3 justify-content-between">
            <div class="col-sm-4 text-center text-sm-start mb-4 mb-sm-0">
                <img src="/public/images/logo-small-white.png" style="width: 100%; max-width: 150px" alt="Logo de la empresa Ferretera Arcoiris">
            </div>
            <div class="col-auto">
                <ol class="list-unstyled">
                    <li><a href="/#">Inicio</a></li>
                    <li><a href="/products">Productos</a></li>
                    <li><a href="/products/featured">Destacados</a></li>
                    <li><a href="/#about-us">Nosotros</a></li>
                    <li><a href="/#services">Servicios</a></li>
                </ol>
            </div>
            <div class="col-auto">
                <ol class="list-unstyled">
                    <li><a href="/#contact">Contacto</a></li>
                    <li><a href="/#shipping">Recorridos</a></li>
                    <li><a href="/shopping-cart">Carrito</a></li>
                    <li><a href="/admin">Admin</a></li>
                </ol>
            </div>
            <div class="col col-auto text-end text-sm-start">
                <ul class="list-unstyled">
                    <li><a target="_blank" href="https://www.facebook.com/ferretera.arcoiris.96"><i class="bi-facebook me-2"></i> Facebook</a></li>
                    <li><a target="_blank" href="https://www.instagram.com/ferreteraarcoiris"><i class="bi-instagram me-2"></i> Instagram</a></li>
                    <li><a target="_blank" href="https://api.whatsapp.com/send/?phone=543417502550"><i class="bi-whatsapp me-2"></i> Whatsapp</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
<div class="bottom-bar">
    <div class="center">
        <div class="row align-items-center">
            <div class="col col-sm-auto text-end text-sm-start"><a href="/terms-and-policy">Términos del servicio</a></div>
            <div class="col col-sm-auto"><a href="/terms-and-policy">Política de privacidad</a></div>
        </div>
    </div>
</div>`;

        return element;
    }

    _init.call(this);
}

export const siteFooter = new SiteFooter();
