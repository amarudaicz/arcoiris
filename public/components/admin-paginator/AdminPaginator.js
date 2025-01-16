export function AdminPaginator(parent) {
    const _this = this;
    const _root = _getRootHTML();
    const _controlButtons = _root.querySelectorAll('[data-js="control-button"]');
    const _pageButtons = _root.querySelector('[data-js="page-buttons"]');
    const _entryCount = _root.querySelector('[data-js="entry-count"]');

    const _entriesPerPage = 6;
    let _entries = null;
    let _totalPages = 0;
    let _currentPage = 0;

    //Private interface
    function _init() {
        parent.append(_root);

        _controlButtons[0].onclick = _this.previousPage;

        _controlButtons[1].onclick = _this.nextPage;

        window.addEventListener('keyup', function (e) {
            if (e.key === "ArrowLeft") {
                _this.previousPage();
            } else if (e.key === "ArrowRight") {
                _this.nextPage();
            }
        });

        _reset();
    }

    function _getRootHTML() {
        const div = document.createElement('div');

        div.className = "AdminPaginator";

        div.innerHTML = `<div class="entry-count" data-js="entry-count"></div>
        <div class="control-section">
            <button type="button" name="previousPage" class="control-button" data-js="control-button">
                <i class="bi-caret-left-fill"></i>
            </button>
            <div class="page-buttons" data-js="page-buttons">
                <!--page buttons-->
            </div>
            <button type="button" name="nextPage" class="control-button" data-js="control-button">
                <i class="bi-caret-right-fill"></i>
            </button>
        </div>`;

        return div;
    }

    function _showPage(pageNumber) {
        if (pageNumber < 0 || pageNumber >= _totalPages) {
            return;
        }

        const start = _currentPage * _entriesPerPage;

        let end = start + _entriesPerPage;

        if (end > _entries.length) {
            end = _entries.length
        }

        for (let i = start; i < end; i++) {
            _entries[i].classList.remove('d-none');
        }
    }

    function _hidePage(pageNumber) {
        if (pageNumber < 0 || pageNumber >= _totalPages) {
            return;
        }

        const start = _currentPage * _entriesPerPage;

        let end = start + _entriesPerPage;

        if (end > _entries.length) {
            end = _entries.length
        }

        for (let i = start; i < end; i++) {
            _entries[i].classList.add('d-none');
        }
    }

    function _createPageButton(page) {
        const button = document.createElement('button');

        button.type = "button";

        button.className = "page-button";

        button.textContent = page;

        button.onclick = function () {
            _hidePage(_currentPage);
            _currentPage = page - 1;
            _showPage(_currentPage);
            _updateControl();
        }

        return button;
    }

    function _createCurrentPageButton(page) {
        const button = document.createElement('button');

        button.type = "button";

        button.className = "page-button current-page";

        button.textContent = page;

        button.disabled = true;

        return button;
    }

    function _updateControl() {
        _controlButtons[0].disabled = _currentPage === 0;

        _controlButtons[1].disabled = _currentPage >= _totalPages - 1;

        _pageButtons.innerHTML = '';

        let start = _currentPage - 2;

        if (start < 0) {
            start = 0;
        }

        for (let i = start; i < _currentPage; i++) {
            _pageButtons.append(_createPageButton(i + 1));
        }

        _pageButtons.append(_createCurrentPageButton(_currentPage + 1));

        let end = _currentPage + 3

        if (end > _totalPages) {
            end = _totalPages;
        }

        for (let i = _currentPage + 1; i < end; i++) {
            _pageButtons.append(_createPageButton(i + 1));
        }

        const showingStart = (_currentPage * _entriesPerPage) + 1;

        let showingEnd = _currentPage * _entriesPerPage + _entriesPerPage;

        if (showingEnd > _entries.length) {
            showingEnd = _entries.length;
        }

        _entryCount.innerHTML = `<span>Mostrando ${showingStart} - ${showingEnd} de <b>${_entries.length}</b></span>`;
    }

    function _reset() {
        _controlButtons[0].disabled = true;

        _controlButtons[1].disabled = true;

        _pageButtons.innerHTML = '';

        _entries = null;

        _totalPages = 0;

        _currentPage = 0;

        _entryCount.innerHTML = `<span>Mostrando 0 - 0 de <b>0</b></span>`;
    }

    //Public interface
    this.reset = _reset;

    this.setEntries = function (entries) {
        _entries = entries;

        _totalPages = Math.ceil(entries.length / _entriesPerPage);

        _currentPage = 0;

        _showPage(0);

        _updateControl();
    }

    this.updateEntries = function (entries) {
        _entries = entries;

        _showPage(_currentPage);
    }

    this.nextPage = function () {
        if (_currentPage >= _totalPages - 1) {
            return;
        }

        _hidePage(_currentPage);

        _showPage(++_currentPage);

        _updateControl();
    }

    this.previousPage = function () {
        if (_currentPage === 0) {
            return;
        }

        _hidePage(_currentPage)

        _showPage(--_currentPage);

        _updateControl();
    }

    // Component initialization
    _init.call(this);
}
