import header from "/public/components/admin-header/Header.js";

function ModuleLoader() {
    const _self = this;
    const _rootElement = document.querySelector('[data-component="ModuleLoader"]');
    const _modules = [];
    let _currentModule = null;
    let _gotoUrl = null;

    function _init() {
        _setupEventListeners();
    }

    function _setupEventListeners() {
        window.addEventListener('popstate', _self.run);

        window.addEventListener('click', _captureModuleLink);
    }

    function _captureModuleLink(event) {
        let target = event.target;

        while (target !== null) {
            if (target.tagName === "A" && target.dataset.js === "module-link") {
                event.preventDefault();

                _goto(target.pathname);

                return;
            }

            target = target.parentElement;
        }
    }

    function _findModule(url) {
        let foundModule = null;

        _modules.forEach(module => {
            if (url[url.length - 1] === '/') {
                url = url.substring(0, url.length - 1);
            }

            const pattern = new RegExp(`^${module.pattern}$`);

            if (pattern.test(url)) {
                foundModule = module;
            }
        });

        return foundModule;
    }

    function _loadModule(module) {
        const link = document.createElement('link');

        new Promise((resolve, reject) => {
            link.href = module.style;

            link.rel = 'stylesheet';

            link.onload = resolve;

            link.onerror = reject;

            document.head.append(link);

            header.showLoadingModule();
        }).then(() => {
            return import(module.script);
        }).then(response => {
            module.default = response.default;

            _changeModule(module);

            header.hideLoadedModule();
        }).catch((reason) => {
            console.error('There was an error while loading the module');

            console.error(reason.toString());

            link.remove();

            header.hideLoadedModule();
        });
    }

    function _changeModule(module) {
        if (_currentModule === module) return;

        if (!module.default.getRoot) {
            console.error('There was an error while loading the module');

            return;
        }

        if (_currentModule && _currentModule.default.onRelease) {
            _currentModule.default.onRelease();
        }

        _currentModule = module;

        if (_gotoUrl) {
            history.pushState(null, '', _gotoUrl);

            _gotoUrl = null;
        }

        if (module.default.onFocus) {
            module.default.onFocus();
        }

        _rootElement.innerHTML = "";

        _rootElement.append(module.default.getRoot());
    }

    function _goto(url) {
        const module = _findModule(url);

        if (!module) {
            console.error('The module does not exist');

            return;
        }

        _gotoUrl = url;

        if (module.default) {
            _changeModule(module);

            return;
        }

        _loadModule(module);
    }

    this.run = function () {
        const module = _findModule(location.pathname);

        if (!module) {
            console.error('The module does not exist');
            return;
        }

        if (module.default) {
            _changeModule(module);
            return;
        }

        _loadModule(module);
    }

    this.addModule = function (module) {
        _modules.push(module);
    }

    _init.call(this);
}

const moduleLoader = new ModuleLoader();

export default moduleLoader;