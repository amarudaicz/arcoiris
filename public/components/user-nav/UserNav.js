import {userProfile} from "/public/components/util/UserProfile.js";

function UserNav() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _themeButtonElement = _rootElement.querySelector('[data-js="theme-button"]');
    const _accountNameElement = _rootElement.querySelector('[data-js="account-name"]');

    function _init() {
        _setupEventListeners();

        _updateAccountName();

        if (localStorage.getItem('theme')) {
            document.documentElement.setAttribute("data-theme", "dark");
        }

        document.body.append(_rootElement);
    }

    function _setupEventListeners() {
        _themeButtonElement.addEventListener('click', _changeTheme);

        window.addEventListener('click', () => {
            if (_self.isOpen()) {
                _self.close();
            }
        });

        _rootElement.addEventListener('click', (event) => {
            let target = event.target;

            while (target !== null) {
                if (target.dataset.js && target.dataset.js === "module-link") {
                    return;
                }

                target = target.parentElement;
            }

            event.cancelBubble = true;
        });
    }

    function _createRootElement() {
        const div = document.createElement('div');

        div.className = 'UserNav';

        const iconSize = 18;

        div.innerHTML = `<header>
    <div class="account-image"></div>
</header>
        <div class="account-name" data-js="account-name">Unknown User</div>
        <ol>
            <li>
                <a href="/admin/profile" data-js="module-link">
                    <div>Perfil</div>
                    <div>
                        <svg width="${iconSize}" viewBox="0 0 512 512">
                            <path fill="#000" d="M466.895 305.125c-26.863-46.527-10.708-106.152 36.076-133.244l-50.313-87.146c-14.375 8.427-31.088 13.259-48.923 13.259-53.768 0-97.354-43.873-97.354-97.995h-100.629c0.133 16.705-4.037 33.641-12.979 49.126-26.862 46.528-86.578 62.351-133.431 35.379l-50.312 87.146c14.485 8.236 27.025 20.294 35.943 35.739 26.819 46.454 10.756 105.96-35.854 133.112l50.313 87.146c14.325-8.348 30.958-13.127 48.7-13.127 53.598 0 97.072 43.596 97.35 97.479h100.627c-0.043-16.537 4.136-33.285 12.983-48.609 26.818-46.453 86.388-62.297 133.207-35.506l50.313-87.145c-14.39-8.233-26.846-20.249-35.717-35.614zM256 359.666c-57.254 0-103.668-46.412-103.668-103.667 0-57.254 46.413-103.667 103.668-103.667s103.666 46.413 103.666 103.667c-0.001 57.255-46.412 103.667-103.666 103.667z"></path>
                        </svg>
                    </div>
                </a>
            </li>
            <li>
                <button type="button" data-js="theme-button">
                    <div>Tema oscuro</div>
                    <div>
                        <svg class="light-theme-icon" width="${iconSize + 2}" viewBox="0 0 512 448">
                            <path fill="#000" d="M288 224c0-70.5-57.5-128-128-128s-128 57.5-128 128 57.5 128 128 128 128-57.5 128-128zM480 224c0-70.5-57.5-128-128-128h-96.5c39 29.25 64.5 75.75 64.5 128s-25.5 98.75-64.5 128h96.5c70.5 0 128-57.5 128-128zM512 224c0 88.25-71.75 160-160 160h-192c-88.25 0-160-71.75-160-160s71.75-160 160-160h192c88.25 0 160 71.75 160 160z"></path>
                        </svg>
                        <svg class="dark-theme-icon" width="${iconSize + 2}" viewBox="0 0 512 448">
                            <path fill="#000" d="M0 224c0-88.25 71.75-160 160-160h192c88.25 0 160 71.75 160 160s-71.75 160-160 160h-192c-88.25 0-160-71.75-160-160zM352 352c70.5 0 128-57.5 128-128s-57.5-128-128-128-128 57.5-128 128 57.5 128 128 128z"></path>
                        </svg>
                    </div>
                </button>
            </li>
            <li>
                <a type="button" href="/admin/sign-out">
                    <div>Salir</div>
                    <div>
                        <svg width="${iconSize}" viewBox="0 0 512 512">
                            <path fill="#000" d="M320 73.294v67.979c18.103 7.902 34.75 19.204 49.137 33.59 30.221 30.22 46.863 70.4 46.863 113.137s-16.643 82.917-46.863 113.137c-30.22 30.22-70.399 46.863-113.137 46.863s-82.917-16.643-113.137-46.863c-30.22-30.22-46.863-70.4-46.863-113.137s16.643-82.917 46.863-113.137c14.387-14.387 31.034-25.689 49.137-33.591v-67.978c-92.524 27.54-160 113.236-160 214.706 0 123.712 100.289 224 224 224s224-100.288 224-224c0-101.47-67.475-187.166-160-214.706zM224 0h64v256h-64z"></path>
                        </svg>
                    </div>
                </a>
            </li>
        </ol>`;

        return div;
    }

    function _updateAccountName() {
        userProfile.getProfile()
            .then(data => {
                _accountNameElement.textContent = data['profile']['name'];
            })
            .catch(error => {
                console.error('Failed to fetch account name:', error);
            });
    }

    function _changeTheme() {
        if (document.documentElement.getAttribute('data-theme') !== null) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    this.open = function () {
        _rootElement.classList.add('visible');
    }

    this.isOpen = function () {
        return _rootElement.classList.contains('visible');
    }

    this.close = function () {
        _rootElement.classList.remove('visible');
    }

    this.toggle = function () {
        if (_rootElement.classList.contains('visible')) {
            _self.close();
            return
        }

        _self.open();
    };

    _init.call(this);
}

const userNav = new UserNav();

export default userNav;