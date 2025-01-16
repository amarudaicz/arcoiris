<?php

namespace api;

use config\PathConfiguration;
use Exception;
use JsonException;
use models\Product;
use models\Customer;
use models\ProductCategory;
use models\Connection;
use helpers\Response;

/**
 *
 */
abstract class Settings {
    /**
     * @return void
     * @throws JsonException
     * @throws Exception
     */
    public static function sync(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        if ($request->token !== '6b894a0b352fad5fa8841c84bf5f5585708b00e94f6091024bd25c5f') {
            throw new Exception('Acción no permitida', 403);
        }

        Connection::getConn()->begin_transaction();

        self::truncateTables();

        self::loadCategories();

        self::loadCustomers();

        self::loadProducts();

        Connection::getConn()->commit();

        Response::setCode(200);
    }

    /**
     * @return void
     */
    private static function truncateTables(): void {
        Connection::getConn()->real_query("SET foreign_key_checks = false");

        Connection::getConn()->real_query("TRUNCATE TABLE product_categories");

        Connection::getConn()->real_query("TRUNCATE TABLE customers");

        Connection::getConn()->real_query("TRUNCATE TABLE products");
    }

    /**
     * @return void
     */
    private static function loadCategories(): void {
        $categoryCSVFile = fopen(PathConfiguration::CSV_PATH . '/generos.csv', 'r');

        while (($row = fgetcsv($categoryCSVFile, null, ';'))) {
            $category = new ProductCategory();

            $category->setCode($row[0]);

            $category->setDescription(iconv('latin1', 'utf8', $row[1]));

            try {
                ProductCategory::createCategory($category);
            } catch (Exception $e) {
                //empty
            }
        }

        fclose($categoryCSVFile);
    }

    /**
     * @return void
     */
    private static function loadCustomers(): void {
        $customerCSVFile = fopen(PathConfiguration::CSV_PATH . '/clientes.csv', 'r');

        while (($row = fgetcsv($customerCSVFile, null, ";")) !== false) {
            $csvCustomerZone = $row[1];
            $csvCustomerName = iconv('latin1', 'utf8', $row[3]);
            
            $csvCustomerDNI = $row[8];
            $csvCustomerPriceList = $row[19];
            $csvCustomerNumber = $row[2];
            $customer = new Customer();
            $customer->setName($csvCustomerName);
            $customer->setDni($csvCustomerDNI);
            $customer->setZone($csvCustomerZone);
            $customer->setPriceList($csvCustomerPriceList);
            $customer->setNumber($csvCustomerNumber);
            try {
                Customer::createCustomer($customer);
            } catch (Exception $th) {
            }
        }

        Connection::getConn()->real_query('DELETE FROM customer_users WHERE dni IN (SELECT cu.dni FROM customer_users cu LEFT JOIN customers c ON c.dni = cu.dni)');
        fclose($customerCSVFile);
    }

    /**
     * @return void
     */
    private static function loadProducts(): void {
        $productCSVFile = fopen(PathConfiguration::CSV_PATH . '/articulo.csv', 'r');

        while (($row = fgetcsv($productCSVFile, null, ";")) !== false) {
            $csvCategoryCode = trim($row[0]);
            $csvProductCode = trim($row[2]);
            $csvProductPrice = str_replace(',', '.', trim($row[5]));
            $csvFeatured = trim($row[7]);
            $csvProductStock = str_replace(',', '.', trim($row[10]));
            $csvPrice1 = str_replace(',', '.', trim($row[12]));
            $csvPrice2 = str_replace(',', '.', trim($row[14]));
            $csvPrice3 = str_replace(',', '.', trim($row[16]));
            $csvPrice4 = str_replace(',', '.', trim($row[18]));
            $csvPrice5 = str_replace(',', '.', trim($row[20]));
            $csvPrice6 = str_replace(',', '.', trim($row[22]));
            $csvProductDescription = iconv('latin1', 'utf8', $row[3]);

            $product = new Product();
            $product->setCode($csvProductCode);
            $product->setDescription($csvProductDescription);
            $product->setStock($csvProductStock);
            $product->setPrice($csvProductPrice);
            $product->setPrice1($csvPrice1);
            $product->setPrice2($csvPrice2);
            $product->setPrice3($csvPrice3);
            $product->setPrice4($csvPrice4);
            $product->setPrice5($csvPrice5);
            $product->setPrice6($csvPrice6);
            $product->setFeatured($csvFeatured === 'S');
            $product->setCategoryCode($csvCategoryCode);
            Product::createProduct($product);

            try {
                Product::createProduct($product);
            } catch (Exception $e) {
                //empty
            }
        }
        fclose($productCSVFile);
    }
}