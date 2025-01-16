import {disableSubmitButton, enableSubmitButton} from "/public/components/util/SubmitButtons.js";
import {SwtError, SwtSuccess} from "/public/components/util/BoxMessage.js";

function ContactForm() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _contactFormElement = _rootElement.querySelector('[data-js="contact-form"]');
    let _verify = false;

    function _init() {
        _setupEventListeners();

        _loadRecaptchaAPI();
    }

    function _setupEventListeners() {
        _contactFormElement.onsubmit = function (event) {
            _onSubmitForm.call(_contactFormElement, event);
            return false;
        };
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="ContactForm"]');

        element.className = 'ContactForm';

        return element;
    }

    function _loadRecaptchaAPI() {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadRecaptcha&render=explicit&hl=es';
        script.async = true;
        script.defer = true;
        document.head.append(script);
        window.onloadRecaptcha = _onloadRecaptcha;
    }

    function _onloadRecaptcha() {
        grecaptcha.render(_rootElement.querySelector('[data-js="recaptcha"]'), {
            'sitekey': "6LeDUzAkAAAAAJfiVgHgn3QJXUPfIosGDJ9shCmC",
            'callback': _onVerifyRecaptcha,
            'expired-callback': _onExpireRecaptcha,
        });
    }

    function _onVerifyRecaptcha() {
        _verify = true;
    }

    function _onExpireRecaptcha() {
        _verify = false;
    }

    function _resetRecaptcha() {
        grecaptcha.reset();
        _verify = false;
    }

    function _onSubmitForm() {
        if (!_verify) {
            return false;
        }

        disableSubmitButton(_contactFormElement['submit']);

        const data = {
            name: _contactFormElement['name'].value,
            email: _contactFormElement['email'].value,
            phone: _contactFormElement['phone'].value,
            message: _contactFormElement['message'].value
        }

        setTimeout(() => {
            fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(resp => {
                    enableSubmitButton(_contactFormElement['submit']);
                    if (resp.code === 200) {
                        _contactFormElement.reset();

                        _resetRecaptcha();

                        SwtSuccess.fire({
                            title: 'Mensaje enviado!',
                            text: 'Nos contactaremos contigo a la brevedad. Gracias!',
                        }).then();


                        return;
                    }

                    throw new Error(resp.message);
                })
                .catch(reason => {
                    SwtError.fire({
                        title: 'Algo salio mal',
                        text: 'No se pudo realizar el contacto. Intente mas tarde.'
                    }).then();
                    enableSubmitButton(_contactFormElement['submit']);
                });
        }, 400);
    }

    _init.call(_self);
}

new ContactForm();