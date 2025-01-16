<?php

use helpers\Logger;
use models\Product;
use models\Customer;
use models\Connection;
use models\ProductCategory;
use config\EmailConfiguration;
use PHPMailer\PHPMailer\PHPMailer;

include_once 'vendor/autoload.php';
include_once 'config/config.php';
/**
 *
 */
abstract class Application {
    /**
     * @var stdClass|null
     */
    private static ?stdClass $cliArguments = null;

    /**
     * @return void
     */
    public static function main(): void {
        try {
            if (php_sapi_name() !== 'cli')
                throw new RuntimeException('This application can only be run from the command line.');

            self::parseCLIArguments();

            self::configureLogging();

            switch (self::$cliArguments->command) {
                case 'cron':
                    self::handleCron();
                    break;
                case 'smtp':
                    self::handleSMTP();
                    break;
                case 'version':
                    self::displayVersion();
                    break;
                case 'help':
                default:
                    self::displayHelp();
                    break;
            }
        } catch (Exception $e) {
            Logger::log('ERROR', $e->getMessage());
        }
    }

    /**
     * @return void
     */
    private static function parseCLIArguments(): void {
        $options = getopt('vh', [
            'cron', 'version', 'smtp', 'help',
            'email:', 'name:',
            'log-to-file'
        ]);

        self::$cliArguments = new stdClass();

        self::$cliArguments->command = null;
        if (isset($options['cron'])) self::$cliArguments->command = 'cron';
        if (isset($options['smtp'])) self::$cliArguments->command = 'smtp';
        if (isset($options['version']) || isset($options['v'])) self::$cliArguments->command = 'version';
        if (isset($options['help']) || isset($options['h'])) self::$cliArguments->command = 'help';

        self::$cliArguments->name = !empty($options['name']) ? $options['name'] : null;
        self::$cliArguments->email = !empty($options['email']) ? $options['email'] : null;

        self::$cliArguments->logToFile = isset($options['log-to-file']);
    }

    /**
     * @return void
     */
    private static function configureLogging(): void {
        if (!self::$cliArguments->logToFile) return;
        Logger::configure(__DIR__ . '/.application.log');
    }

    /**
     * @return void
     */
    private static function handleCron(): void {
        $currentTime = date('H:i');

        $runTime = ['10:00', '13:00', '19:00']; // UTC

        if (!in_array($currentTime, $runTime)) {
            Logger::log('DEBUG', 'Time does not match');
            return;
        }

        Connection::getConn()->begin_transaction();

        self::truncateTables();
        self::loadCategories();
        // self::loadCustomers();
        self::importCustomersFromCsvFile();
        self::importProductsFromCsvFile();
        // self::loadProducts();
        Connection::getConn()->commit();
    }

    /**
     * @return void
     */
    private static function truncateTables(): void {
        Logger::log('INFO', 'Truncating tables');

        Connection::getConn()->real_query("SET foreign_key_checks = false");

        Connection::getConn()->real_query("TRUNCATE TABLE product_categories");

        Connection::getConn()->real_query("TRUNCATE TABLE customers");

        Connection::getConn()->real_query("TRUNCATE TABLE products");
    }

    /**
     * @return void
     */
    private static function loadCategories(): void {
        Logger::log('INFO', 'Loading categories');

        $categoryCSVFile = __DIR__ . '/storage/csv/generos.csv';

        if (!file_exists($categoryCSVFile))
            throw new RuntimeException('File ' . $categoryCSVFile . ' not found');

        $fd = fopen($categoryCSVFile, 'r');

        if ($fd === false)
            throw new RuntimeException('File ' . $categoryCSVFile . ' could not be opened');

        while (($row = fgetcsv($fd, null, ';'))) {
            $category = new ProductCategory();
            $category->setCode($row[0]);
            $category->setDescription($row[1]);

            try {
                ProductCategory::createCategory($category);
            } catch (Exception $e) {
                Logger::log('WARNING', $e->getMessage());
            }
        }

        fclose($fd);
    }

    /**
     * @return void
     */
    private static function loadCustomers(): void {
        Logger::log('INFO', 'Loading customers');

        $customerCSVFile = __DIR__ . '/storage/csv/clientes.csv';

        if (!file_exists($customerCSVFile))
            throw new RuntimeException('File ' . $customerCSVFile . ' not found');

        $fd = fopen($customerCSVFile, 'r');

        if ($fd === false)
            throw new RuntimeException('File ' . $customerCSVFile . ' could not be opened');

        while (($row = fgetcsv($fd, null, ';'))) {
            $customer = new Customer();
            $customer->setDni($row[8]);
            $customer->setNumber($row[2]);
            $customer->setName(iconv('latin1', 'utf8', $row[3]));
            $customer->setZone($row[1]);

            try {
                Customer::createCustomer($customer);
            } catch (Exception $e) {
                Logger::log('WARNING', $e->getMessage());
            }
        }

        fclose($fd);

        Connection::getConn()->real_query('DELETE FROM customer_users WHERE dni IN (SELECT cu.dni FROM customer_users cu LEFT JOIN customers c ON c.dni = cu.dni)');
    }


    private static function importCustomersFromCsvFile(): void {
        Logger::log('INFO', 'Importing customers from csv file');

        $customerCSVFile = __DIR__ . "/storage/csv/clientes.csv";

        if (!file_exists($customerCSVFile))
            throw new Exception('File ' . $customerCSVFile . ' does not exist');

        $fd = fopen($customerCSVFile, "r");

        if ($fd === false)
            throw new Exception("Error opening file " . $customerCSVFile);

        while (($row = fgetcsv($fd, null, ";")) !== false) {
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
            Customer::createCustomer($customer);
        }

        Connection::getConn()->real_query('DELETE FROM customer_users WHERE dni IN (SELECT cu.dni FROM customer_users cu LEFT JOIN customers c ON c.dni = cu.dni)');
        fclose($fd);
    }

    /**
     * @return void
     */
    private static function loadProducts(): void {
        Logger::log('INFO', 'Loading products');

        $productCSVFile = __DIR__ . '/storage/csv/articulo.csv';

        if (!file_exists($productCSVFile))
            throw new RuntimeException('File ' . $productCSVFile . ' not found');

        $fd = fopen($productCSVFile, 'r');

        if ($fd === false)
            throw new RuntimeException('File ' . $productCSVFile . ' could not be opened');

        while (($row = fgetcsv($fd, null, ';'))) {
            $csvCustomerDescription = $row[3];
            $product = new Product();
            $product->setCode($row[2]);
            $product->setDescription($csvCustomerDescription);
            $product->setPrice(str_replace(',', '.', $row[5]));
            $product->setCategoryCode($row[0]);
            $product->setFeatured($row[7] === 'S');

            try {
                Product::createProduct($product);
            } catch (Exception $e) {
                Logger::log('WARNING', $e->getMessage());
            }
        }

        fclose($fd);
    }

    private static function importProductsFromCsvFile(): void {
        Logger::log('INFO', 'Importing products from csv file');

        $productCSVFile = __DIR__ . "/storage/csv/articulo.csv";

        if (!file_exists($productCSVFile))
            throw new Exception('File ' . $productCSVFile . ' does not exist');

        $fd = fopen($productCSVFile, "r");

        if ($fd === false)
            throw new Exception("Error opening file " . $productCSVFile);

        while (($row = fgetcsv($fd, null, ";")) !== false) {
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
        }
        fclose($fd);

    }

    /**
     * @return void
     * @throws \PHPMailer\PHPMailer\Exception
     */
    private static function handleSMTP(): void {
        if (empty(self::$cliArguments->email))
            throw new RuntimeException('Email is required');

        $mailer = new PHPMailer(true);
        $mailer->Host = EmailConfiguration::SMTP_HOST;
        $mailer->Port = EmailConfiguration::SMTP_PORT;
        $mailer->Username = EmailConfiguration::SMTP_USERNAME;
        $mailer->Password = EmailConfiguration::SMTP_PASSWORD;
        $mailer->SMTPAuth = true;
        $mailer->CharSet = PHPMailer::CHARSET_UTF8;
        $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mailer->isSMTP();
        $mailer->isHTML();

        $mailer->Subject = 'This is a test';
        $mailer->Body = 'This is a test message';

        $mailer->setFrom(EmailConfiguration::SENDER_EMAIL, EmailConfiguration::SENDER_NAME);
        $mailer->addAddress(self::$cliArguments->email, self::$cliArguments->name ?? '');

        if (!$mailer->send())
            throw new RuntimeException('Mailer Error: ' . $mailer->ErrorInfo);
    }

    /**
     * @return void
     */
    private static function displayVersion(): void {
        printf("Version: 1.0.0\n");
    }

    /**
     * @return void
     */
    private static function displayHelp(): void {
        if (!file_exists('.help'))
            throw new RuntimeException('Help file does not exist.');
        echo file_get_contents('.help');
    }
}

Application::main();