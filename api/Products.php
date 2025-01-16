<?php

namespace api;

use config\PathConfiguration;
use Exception;
use helpers\Logger;
use helpers\Response;
use models\Connection;
use models\Product;
use models\ProductDetail;
use models\Session;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

/**
 *
 */
abstract class Products {
    /**
     * @return void
     */
    public static function getProducts(): void {

        $account = Session::getCustomer();
        $price_list = $account ? $account->getPriceList() : null;
        $featured = !empty($_GET['featured']) ? 1 : 0;  

        
        $products = Product::getProducts($price_list, $featured);

        Response::append('products', $products);

        Response::setCode(200);
    }

    /**
     * @param string $productCode
     *
     * @return void
     * @throws Exception
     */
    public static function updateProductDetail(string $productCode): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        Connection::getConn()->begin_transaction();

        if (empty($request->additionalDescription)) {
            $request->additionalDescription = '';
        }

        $product = Product::getProduct($productCode);

        if (!$product) {
            throw new Exception('El producto no existe', 404);
        }

        $productDetail = ProductDetail::getByCode($product->getCode());

        $isNew = false;

        if (!$productDetail) {
            $isNew = true;

            $productDetail = new ProductDetail();

            $productDetail->setCode($product->getCode());
        }

        $productDetail->setAdditionalDescription($request->additionalDescription);

        if ($isNew) {
            ProductDetail::createProductDetail($productDetail);
        } else {
            ProductDetail::updateProductDetail($productDetail);
        }

        Connection::getConn()->commit();

        Response::setCode(200);
    }

    /**
     * @param string $productCode
     *
     * @return void
     * @throws Exception
     */
    public static function updateProductImage(string $productCode): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $imageMIMETypes = ['image/jpeg' => 'jpeg', 'image/png' => 'png', 'image/jpg' => 'jpg'];

        Connection::getConn()->begin_transaction();

        if (!isset($_FILES['file'])) {
            throw new Exception('Imagen requerida', 404);
        }

        if (!is_uploaded_file($_FILES['file']['tmp_name'])) {
            throw new Exception('Archivo invalido', 400);
        }

        $mimeType = mime_content_type($_FILES['file']['tmp_name']);

        if (!in_array($mimeType, array_keys($imageMIMETypes))) {
            throw new Exception('Tipo de archivo invalido', 400);
        }

        $product = Product::getProduct($productCode);

        if (!$product) {
            throw new Exception('El producto no existe', 404);
        }

        $productDetail = ProductDetail::getByCode($product->getCode());

        $isNew = false;

        if (!$productDetail) {
            $isNew = true;

            $productDetail = new ProductDetail();
        }

        $productDetail->setCode($product->getCode());

        if (!$isNew && is_file($productDetail->getImagePath())) {
            if (!unlink($productDetail->getImagePath())) {
                throw new Exception('No se puede eliminar la imagen anterior', 500);
            }
        }

        $productDetail->setImagePath(sprintf(PathConfiguration::UPLOADS_PATH . '/%s.%s', $product->getCode(), $imageMIMETypes[$mimeType]));

        move_uploaded_file($_FILES['file']['tmp_name'], $productDetail->getImagePath());

        if ($isNew) {
            ProductDetail::createProductDetail($productDetail);
        } else {
            ProductDetail::updateProductDetail($productDetail);
        }

        Connection::getConn()->commit();

        Response::append('imagePath', $productDetail->getImagePath());

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     */
    public static function uploadFeaturedCatalog(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        if (!isset($_FILES['file-hidden'])) {
            throw new Exception('Archivo requerido', 400);
        }

        if (!is_uploaded_file($_FILES['file-hidden']['tmp_name'])) {
            throw new Exception('Archivo invalido', 400);
        }

        $mimeType = mime_content_type($_FILES['file-hidden']['tmp_name']);

        if ($mimeType !== 'application/pdf') {
            throw new Exception('Tipo de archivo invalido', 400);
        }

        move_uploaded_file($_FILES['file-hidden']['tmp_name'], PathConfiguration::CATALOG_PATH . '/catalogo-destacados.pdf');

        Response::setCode(200);
    }
}