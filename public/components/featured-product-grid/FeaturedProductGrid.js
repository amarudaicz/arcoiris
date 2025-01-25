import {
  disableEntryButton,
  enableEntryButton,
} from "/public/components/util/SubmitButtons.js";
import {
  SwtError,
  SwtInfo,
  SwtSuccess,
} from "/public/components/util/BoxMessage.js";
import { siteHeader } from "/public/components/site-header/SiteHeader.js";
import { Paginator } from "/public/components/paginator/Paginator.js";
import { currencyFormat } from "/public/components/util/Util.js";
import { appState } from "/public/components//util/AppState.js";
import { addProduct } from "/public/components/util/CartActions.js";

function FeaturedProductGrid(options = {}) {
  const _rootElement = _createRootElement();
  const _statusElements = _rootElement.querySelectorAll('[data-js="status"]');
  const _filterFormElement = _rootElement.querySelector(
    '[data-js="filter-form"]'
  );
  const _filterLoaderElement = _rootElement.querySelector(
    '[data-js="filter-loader"]'
  );
  const _entryContainerElement = _rootElement.querySelector(
    '[data-js="entry-container"]'
  );
  const _downloadButtonElements = _rootElement.querySelectorAll(
    '[data-js="download-button"]'
  );
  const _paginatorContainerElement = _rootElement.querySelector(
    '[data-js="paginator-container"]'
  );

  let _paginator = null;
  let _searchTimeOut = null;

  function _init() {
    _setupPaginator();
    _setupEventListeners();
    _fetchProducts();
  }

  function _createRootElement() {
    const element = document.querySelector(
      '[data-component="FeaturedProductGrid"]'
    );

    element.className = "FeaturedProductGrid";

    element.innerHTML = `<div class="row g-2 mb-3 justify-content-end align-items-center">
    <div class="col-auto"><span class="me-2 spinner-border spinner-border-sm d-none" data-js="filter-loader"></span></div>
    <div class="col-auto">
        <button type="button" name="download-pdf" data-js="download-button" class="btn btn-sm btn-danger">
            <span><i class="bi-file-pdf-fill me-2"></i>Descargar</span>
            <span class="spinner-border-sm spinner-border d-none"></span>
        </button>
    </div>
    <div class="col-auto">
        <button type="button" name="download-excel" data-js="download-button" class="btn btn-sm btn-success btn-secondary">
            <span><i class="bi-file-excel-fill me-2"></i>Descargar</span>
            <span class="spinner-border-sm spinner-border d-none"></span>
        </button>
    </div>
</div>
<form class="top-filter mb-4" data-js="filter-form">
    <label for="category" hidden=""></label>
    <select id="category" name="category">
        <!---->
    </select>
    <label for="search" hidden=""></label>
    <input id="search" type="text" name="search" placeholder="Palabra clave">
    <label for="sort" hidden=""></label>
    <select id="sort" name="sort">
        <option value="0">Descripción</option>
        <option value="1">Mayor precio</option>
        <option value="2">Menor precio</option>
        <option value="3" selected>Mas visitado</option>
    </select>
</form>
<div class="status loading" data-js="status">
    <span class="spinner-border"></span>
</div>
<div class="status no-entries d-none" data-js="status">
    <div class="text-center">
        <img class="status-image" src="/public/images/no-entries.webp" alt="Imagen de sin resultados">
        <p class="h4 text-secondary fw-bold text-center">No se encontraron resultados.</p>
    </div>
</div>
<div class="status error d-none" data-js="status">
    <div class="text-center">
        <img class="status-image" src="/public/images/error.png" alt="Imagen de error">
        <p class="h4 text-danger fw-bold text-center">Oops! Algo salio mal.</p>
    </div>
</div>
<div class="entry-container row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" data-js="entry-container">
    <!--entries-->
</div>
<div data-js="paginator-container">
    <!--Paginator-->
</div>`;

    return element;
  }

  function _setupPaginator() {
    _paginator = new Paginator(_paginatorContainerElement, {
      entriesPerPage: 6,
    });
  }

  function _setupEventListeners() {
    _filterFormElement.onsubmit = function () {
      return false;
    };

    _downloadButtonElements[0].onclick = _downloadPDF;

    _downloadButtonElements[1].onclick = _downloadExcel;

    _filterFormElement["category"].onchange = function () {
      _filterLoaderElement.classList.remove("d-none");
      _blockFilter();
      setTimeout(_filterEntries, 100);
    };

    _filterFormElement["search"].oninput = function () {
      if (_searchTimeOut) {
        clearTimeout(_searchTimeOut);
        _searchTimeOut = null;
      }

      _searchTimeOut = setTimeout(() => {
        _blockFilter();
        _filterLoaderElement.classList.remove("d-none");
        setTimeout(_filterEntries, 100);
      }, 500);
    };

    _filterFormElement["sort"].onchange = function () {
      _blockFilter();
      _filterLoaderElement.classList.remove("d-none");
      setTimeout(_filterEntries, 100);
    };

    _paginator.onChangePage = function () {
      window.scrollTo(0, 0);
    };
  }

  function _fetchProducts() {
    _setLoading();

    _blockFilter();

    _filterLoaderElement.classList.remove("d-none");

    setTimeout(() => {
      fetch(`/api/v1/products?featured=true`)
        .then((resp) => resp.json())
        .then((resp) => {
          if (resp.code === 200) {
            _processProducts(resp.data);
            _unblockFilter();
          } else throw new Error(resp.message);
        })
        .catch((reason) => {
          _setError();
          SwtError.fire({ title: reason }).then();
        });
    }, 400);
  }

  function _processProducts(data) {
    _entryContainerElement.innerHTML = "";

    _filterFormElement["category"].innerHTML = "";

    const categoryMap = {};

    data["products"].forEach((product) => {
      _entryContainerElement.append(_createProductElement(product));

      if (!categoryMap[product['category']["code"]]) {
        categoryMap[product['category']["code"]] = product['category']["description"];
      }
    });

    Object.keys(categoryMap).forEach((categoryCode) => {
      _filterFormElement["category"].append(
        _createCategoryOptionElement(categoryCode, categoryMap[categoryCode])
      );
    });

    _sortCategories();

    _filterFormElement["category"].prepend(
      _createCategoryOptionElement(0, "TODAS")
    );

    _filterEntries();
  }

  function _createCategoryOptionElement(id, description) {
    const element = document.createElement("option");

    element.textContent = description;

    element.value = id;

    if (id === 0) {
      element.selected = true;
    }

    return element;
  }

  function _createProductElement(product) {
    const element = document.createElement("div");

    element.className = "col";

    element.setAttribute("data-description", product["description"]);
    element.setAttribute("data-category", product['category']["description"]);
    element.setAttribute("data-category-code", product['category']["code"]);
    element.setAttribute("data-price", product["price"]);
    element.setAttribute("data-frequency", product["frequency"]);

    element.innerHTML = `<div class="product">
            <div class="product-header">
                <img src="/${
                  product['productDetail']["imagePath"]
                }" class="product-image" loading="lazy" alt="Imagen que representa al producto en la grilla">
                ${
                  parseInt(product["price"])
                    ? `<div class="product-price">${currencyFormat(
                        product["price"]
                      )}</div>`
                    : ""
                }
            </div>
            <div class="product-content">
                <p class="product-description mb-0">
                    ${product["description"]}
                </p>
                <p class="product-category small text-secondary mb-3">
                    ${product['category']["description"]}
                </p>
                ${
                  product['productDetail']['additionalDescription'] &&
                  product['productDetail']['additionalDescription'].length > 0
                    ? `
                    <p class="additional-text small text-secondary mb-3">
                        ${product['productDetail']['additionalDescription']}
                    </p>
                `
                    : ""
                }
                <div class="row">
                    <div class="col">
                        <div class="input-group">
                            <input type="number" name="product-quantity" class="product-quantity form-control" data-js="product-quantity" placeholder="1">
                            <button id="product${
                                product.code
                              }" name="product-add-button" class="btn btn-warning" data-js="product-add-button">
                              <span class="bi-cart-plus-fill"></span>
                              <span class="spinner-border-sm spinner-border spinner-add d-none"></span>
                            </button>

                            </div>
                    </div>
                    <div class="col-auto">
                        <div class="product-code p-2">
                            cod. ${product["code"].toString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    const productAddButton = element.querySelector(
      '[data-js="product-add-button"]'
    );
    const productQuantity = element.querySelector(
      '[data-js="product-quantity"]'
    );

    productAddButton.onclick = _onClickProduct.bind(
      productAddButton,
      product,
      productQuantity
    );

    return element;
  }
  async function _onClickProduct(product, productQuantity) {

    const customer = appState.getState().customer;
    if (!customer) {
      SwtInfo.fire({
        title: "Inicia sesión para poder agregar al carrito",
      }).then();
      return;
    }


    const button = document.getElementById("product" + product.code);

    if (!button) return;

    const cartIcon = button.querySelector(".bi-cart-plus-fill");
    const spinner = button.querySelector(".spinner-add");

    if (cartIcon && spinner) {
      cartIcon.classList.add("d-none");
      spinner.classList.remove("d-none");
    }

    const quantity =
      parseInt(productQuantity.value) > 0 ? parseInt(productQuantity.value) : 1;

    const existInCart = appState
      .getState()
      .cart.findIndex((item) => item.productCode === product["code"]);

   

    if (!appState.getState().cart) {
      appState.getState().cart = [];
    }

    console.log(existInCart);

    if (existInCart !== -1) {
      appState.getState().cart[existInCart].quantity += quantity;
    } else {
      appState.getState().cart.push({
        productCode: product["code"],
        image: product['productDetail']["imagePath"],
        description: product["description"],
        price: product["price"],
        quantity:
          parseInt(productQuantity.value) > 0
            ? parseInt(productQuantity.value)
            : 1,
        total: product["price"],
      });
    }

    const addPersistentProduct = await addProduct(
      customer.dni,
      product,
      quantity
    );

    if (addPersistentProduct.code === 400) {
      SwtError.fire({ title: "Ocurrió un error al agregar al carrito" }).then();
      if (cartIcon && spinner) {
        spinner.classList.add("d-none");
        cartIcon.classList.remove("d-none");
      }
      return;
    } else if (addPersistentProduct.code === 401) {
      SwtInfo.fire({ title: "Tu sesión expiro regístrate nuevamente" });
      if (cartIcon && spinner) {
        spinner.classList.add("d-none");
        cartIcon.classList.remove("d-none");
      }
      return;
    }

    appState.getState().cart = addPersistentProduct.data.items;

    productQuantity.value = "";

    if (existInCart === -1) {
      siteHeader.addCartCount();
    }

    SwtSuccess.fire({ title: "Item agregado al carrito" }).then();

    appState.saveState();

    appState.notifyAll();

    if (cartIcon && spinner) {
      spinner.classList.add("d-none");
      cartIcon.classList.remove("d-none");
    }
  }
  function _sortCategories() {
    const categories = Array.from(_filterFormElement["category"].children);

    categories.sort((optA, optB) => {
      return optA.textContent.localeCompare(optB.textContent);
    });

    categories.forEach((option) => {
      _filterFormElement["category"].append(option);
    });
  }

  function _filterEntries() {
    console.time("filter");

    let _filteredEntries = Array.from(_entryContainerElement.children);

    _filteredEntries = _filteredEntries.filter((entry) => {
      let cond1 = true;
      let cond2 = true;

      entry.classList.add("d-none");

      if (_filterFormElement["category"].value !== "0") {
        cond1 =
          entry.dataset["categoryCode"] ===
          _filterFormElement["category"].value;
      }

      if (_filterFormElement["search"].value.trim().length > 0) {
        const searchValue = _filterFormElement["search"].value
          .toLowerCase()
          .normalize("NFD"); // Normaliza el texto (opcional para acentos)

        const searchWords = searchValue
          .split(" ")
          .filter((word) => word.trim() !== ""); // Divide en palabras

        const entryText = entry.textContent.toLowerCase().normalize("NFD"); // Normaliza el texto

        return searchWords.every((word) => entryText.includes(word));
      }

      return cond1 && cond2;
    });

    switch (parseInt(_filterFormElement["sort"].value)) {
      case 0:
        _filteredEntries.sort((itemB, itemA) => {
          return itemB.dataset.category
            .toLowerCase()
            .localeCompare(itemA.dataset.category.toLowerCase());
        });
        _filteredEntries.sort((itemB, itemA) => {
          if (itemB.dataset.category === itemA.dataset.category)
            return itemB.dataset.description
              .toLowerCase()
              .localeCompare(itemA.dataset.description.toLowerCase());
          return 0;
        });
        break;
      case 1:
        _filteredEntries.sort((itemB, itemA) => {
          return (
            parseFloat(itemA.dataset.price) - parseFloat(itemB.dataset.price)
          );
        });
        break;
      case 2:
        _filteredEntries.sort((itemA, itemB) => {
          return (
            parseFloat(itemA.dataset.price) - parseFloat(itemB.dataset.price)
          );
        });
        break;
      case 3:
        _filteredEntries.sort((itemA, itemB) => {
          return (
            parseFloat(itemB.dataset.frequency) -
            parseFloat(itemA.dataset.frequency)
          );
        });
        break;
    }

    _filteredEntries.forEach((item) => {
      _entryContainerElement.append(item);
    });

    _paginator.setEntries(_filteredEntries);

    if (_filteredEntries.length > 0) {
      _setLoaded();
    } else {
      _setNoEntries();
    }

    _filterLoaderElement.classList.add("d-none");

    _unblockFilter();

    _filterFormElement["search"].focus();

    console.timeEnd("filter");
  }

  function _downloadExcel() {
    disableEntryButton(this);

    setTimeout(() => {
      window.open("/products/featured/download/xml", "_blank");
      enableEntryButton(this);
    }, 400);
  }

  function _downloadPDF() {
    const categoryCode = _filterFormElement["category"].value;

    if (categoryCode === "0") {
      SwtInfo.fire({ title: "Seleccione una categoría para descargar" }).then();
      return;
    }

    disableEntryButton(this);

    const iframe = document.createElement("iframe");

    iframe.src = `/products/featured/download/pdf?category_code=${categoryCode}`;

    iframe.style.display = "none";

    document.body.append(iframe);

    iframe.addEventListener("load", () => {
      iframe.contentWindow.print();

      iframe.contentWindow.onafterprint = () => {
        iframe.remove();

        enableEntryButton(this);
      };
    });
  }

  function _blockFilter() {
    _filterFormElement.firstElementChild.classList.add("disabled");
    _filterFormElement["category"].disabled = true;
    _filterFormElement["search"].disabled = true;
    _filterFormElement["sort"].disabled = true;
  }

  function _unblockFilter() {
    _filterFormElement.firstElementChild.classList.remove("disabled");
    _filterFormElement["category"].disabled = false;
    _filterFormElement["search"].disabled = false;
    _filterFormElement["sort"].disabled = false;
  }

  function _setLoading() {
    _statusElements[0].classList.remove("d-none");
    _statusElements[1].classList.add("d-none");
    _statusElements[2].classList.add("d-none");
    _entryContainerElement.classList.add("d-none");
    _paginatorContainerElement.classList.add("d-none");
  }

  function _setLoaded() {
    _statusElements[0].classList.add("d-none");
    _statusElements[1].classList.add("d-none");
    _statusElements[2].classList.add("d-none");
    _entryContainerElement.classList.remove("d-none");
    _paginatorContainerElement.classList.remove("d-none");
  }

  function _setNoEntries() {
    _statusElements[0].classList.add("d-none");
    _statusElements[1].classList.remove("d-none");
    _statusElements[2].classList.add("d-none");
    _entryContainerElement.classList.add("d-none");
    _paginatorContainerElement.classList.add("d-none");
  }

  function _setError() {
    _statusElements[0].classList.add("d-none");
    _statusElements[1].classList.add("d-none");
    _statusElements[2].classList.remove("d-none");
    _entryContainerElement.classList.add("d-none");
    _paginatorContainerElement.classList.add("d-none");
  }

  _init.call(this);
}

export const products = new FeaturedProductGrid();
