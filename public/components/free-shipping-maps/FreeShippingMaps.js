function FreeShippingMaps() {
    const _self = this;
    const _rootElement = _createRootElement();
    const _mapContainerElement = _rootElement.querySelector('[data-js="map-container"]');
    const _entryContainerElement = _rootElement.querySelector('[data-js="entry-container"]');
    const _freeShippingMaps = [
        {
            "name": "Misiones",
            "map": ""
        },
        {
            "name": "San Luis",
            "map": ""
        },
        {
            "name": "San Juan",
            "map": ""
        },
        {
            "name": "Entre Ríos",
            "map": "<iframe title='Google map del recorrido de reparto en la provincia de Entre Ríos' src=\"https://www.google.com/maps/d/embed?mid=1kcs6nqi6DXPuQZBq0CjYh0MaKxqA-Ww&ehbc=2E312F\" width=\"100%\" height=\"480\"></iframe>\n"
        },
        {
            "name": "Santa Cruz",
            "map": ""
        },
        {
            "name": "Río Negro",
            "map": ""
        },
        {
            "name": "Chubut",
            "map": ""
        },
        {
            "name": "Córdoba",
            "map": ""
        },
        {
            "name": "Mendoza",
            "map": ""
        },
        {
            "name": "La Rioja",
            "map": ""
        },
        {
            "name": "Catamarca",
            "map": ""
        },
        {
            "name": "La Pampa",
            "map": ""
        },
        {
            "name": "Santiago del Estero",
            "map": "<iframe title='Google map del recorrido de reparto en la provincia de Santiago del Estero' src=\"https://www.google.com/maps/d/embed?mid=1aUPwbdfWjZXAu-7KKOV-TzahJ21kWqQ&ehbc=2E312F\" width=\"100%\" height=\"480\"></iframe>"
        },
        {
            "name": "Corrientes",
            "map": ""
        },
        {
            "name": "Santa Fe",
            "map": "<iframe title='Google map del recorrido de reparto en la provincia de Santa Fé' src=\"https://www.google.com/maps/d/embed?mid=1nEW6vDkr1q6psqFr_A7EH7rwf1d4zvE&ehbc=2E312F\" width=\"100%\" height=\"480\"></iframe>"
        },
        {
            "name": "Tucumán",
            "map": ""
        },
        {
            "name": "Neuquén",
            "map": ""
        },
        {
            "name": "Salta",
            "map": ""
        },
        {
            "name": "Chaco",
            "map": "<iframe title='Google map del recorrido de reparto en la provincia de Chaco' src=\"https://www.google.com/maps/d/embed?mid=1i7nYSYCp9ZCj1okINJfWMHFvB9vofiw&ehbc=2E312F\" width=\"100%\" height=\"480\"></iframe>"
        },
        {
            "name": "Formosa",
            "map": ""
        },
        {
            "name": "Jujuy",
            "map": ""
        },
        {
            "name": "CABA",
            "map": ""
        },
        {
            "name": "Buenos Aires",
            "map": ""
        },
        {
            "name": "Tierra del Fuego",
            "map": ""
        }
    ];

    function _init() {
        _processData();
    }

    function _createRootElement() {
        const element = document.querySelector('[data-component="FreeShippingMaps"]');

        element.className = 'FreeShippingMaps';

        element.innerHTML = `<div class="row g-2">
    <div class="col-sm-auto">
        <ol data-js="entry-container"><!--entries--></ol>
    </div>
    <div class="col-sm">
        <div class="delivery-map" data-js="map-container"><!--map--></div>
    </div>
</div>`;

        return element;
    }

    function _processData() {
        _entryContainerElement.innerHTML = '';

        _freeShippingMaps.sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });

        _freeShippingMaps.forEach(province => {
            _entryContainerElement.append(_createEntry(province));
        });
    }

    function _createEntry(province) {
        const element = document.createElement('li');

        element.innerHTML = `<button type="button" name="select-province" data-js="button">${province.name}</button>`;

        const button = element.firstElementChild;

        button.onclick = function () {
            _selectProvince.call(button, province)
        };

        if (province.map.length === 0) {
            button.disabled = true;
        }

        if (province.name === 'Santa Fe') {
            button.classList.add('active');

            button.click();
        }

        return element;
    }

    function _selectProvince(province) {
        Array.from(_entryContainerElement.children).forEach(li => {
            if (li.firstElementChild.classList.contains('active')) {
                li.firstElementChild.classList.remove('active');
            }
        });

        this.classList.add('active');

        _mapContainerElement.innerHTML = province.map;
    }

    _init.call(_self);
}

new FreeShippingMaps();