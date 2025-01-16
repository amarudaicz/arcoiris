<?php

namespace api;

use Exception;
use models\Customer;
use models\Item;
use models\Order;
use JsonException;
use models\Product;
use helpers\Response;
use models\Connection;
use config\PathConfiguration;
use config\EmailConfiguration;
use PHPMailer\PHPMailer\PHPMailer;

/**
 *
 */
abstract class Orders {
    /**
     * @return void
     * @throws Exception
     */
    public static function getOrders(): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        if (isset($_GET['from']) && isset($_GET['to'])) {
            Response::append('orders', Order::getOrdersByDate($_GET['from'], $_GET['to']));
        } else {
            Response::append('orders', Order::getOrders());
        }

        Response::setCode(200);
    }

    /**
     * @param int $orderId
     *
     * @return void
     * @throws Exception
     */
    public static function getOrder(int $orderId): void {
        if (!isset($_SESSION['user'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $order = Order::getOrder($orderId);

        if (!$order) {
            throw new Exception('La orden no existe', 404);
        }

        $items = Item::getItems($order->getId());

        Response::append('order', $order);

        Response::append('items', $items);

        Response::setCode(200);
    }

    /**
     * @return void
     * @throws Exception
     * @throws JsonException
     */
    public static function createOrder(): void {
        if (!isset($_SESSION['customer'])) {
            throw new Exception('Credenciales requeridas', 401);
        }

        $customer = unserialize($_SESSION['customer']);

        $request = json_decode(file_get_contents('php://input'), null, 512, JSON_THROW_ON_ERROR);

        Connection::getConn()->begin_transaction();

        $newOrder = new Order();

        if (isset($request->note)) {
            $newOrder->setNote($request->note);
        }

        if (isset($request->paymentMethod)) {
            $newOrder->setPaymentMethod($request->paymentMethod);
        }

        $newOrder->setCreatedDate(date('Y-m-d H:i:s'));

        $newOrder->setCustomerDni($customer->getDni());

        Order::createOrder($newOrder);

        $filename = sprintf('%s/%08d.txt', PathConfiguration::ORDERS_PATH, $newOrder->getId());

        $fileContent = sprintf("1;%08d\r\n", $newOrder->getId());

        $fileContent .= sprintf("2;%d;%d\r\n", $customer->getZone(), $customer->getNumber());

        if (!(is_array($request->items) && count($request->items) > 0)) {
            throw new Exception('Invalid item list', 400);
        }

        foreach ($request->items as $i => $item) {
            if (!isset($item->productCode)) {
                throw new Exception('Código de producto requerido', 400);
            }

            $product = Product::getProduct($item->productCode);

            $newItem = new Item();

            $newItem->setNumber($i + 1);

            $newItem->setDescription($product->getDescription());

            $newItem->setPrice($product->getPrice());

            if (!isset($item->quantity)) {
                $newItem->setQuantity(1);
            }

            $newItem->setQuantity($item->quantity);

            $newItem->setProductCode($product->getCode());

            $newItem->setOrderId($newOrder->getId());

            Item::createItem($newItem);

            $fileContent .= sprintf("3;%s;%.3f;;0.00;%.3f\r\n",
                $newItem->getProductCode(),
                $newItem->getQuantity(),
                $newItem->getPrice()
            );
        }

        $fileContent .= sprintf("4;%s\r\n", $newOrder->getNote());

        $fileContent .= sprintf("5;%s\r\n", $newOrder->getPaymentMethod());

        if (file_put_contents($filename, $fileContent) === false) {
            throw new Exception('Error al crear la orden de compra', 500);
        }

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

        $mailer->Subject = sprintf('Orden de compra #%08d', $newOrder->getId());

        $mailer->setFrom(EmailConfiguration::SENDER_EMAIL, EmailConfiguration::SENDER_NAME);

        $mailer->addAddress(EmailConfiguration::SALES_RECEIVER_EMAIL, EmailConfiguration::SALES_RECEIVER_NAME);

        $mailer->addAttachment($filename);

        $mailer->Body = file_get_contents(PathConfiguration::TEMPLATES_PATH . '/order-email.html');

        if (!$mailer->send()) {
            throw new Exception('El email no se envió', 500);
        }

        Connection::getConn()->commit();

        Response::append('orderId', $newOrder->getId());

        Response::setCode(200);
    }

    /**
     * @param int $orderId
     *
     * @return void
     * @throws Exception
     */
    public static function downloadCSV(int $orderId): void {
        if (empty($_SESSION['user']))
            throw new Exception('Credenciales requeridas', 401);

        $order = Order::getOrder($orderId);

        if (empty($order))
            throw new Exception('La orden no existe', 404);

        $customer = Customer::getCustomer($order->getCustomerDni());

        if (empty($customer))
            throw new Exception('El cliente no existe', 400);

        $items = Item::getItems($order->getId());

        if (empty($items))
            throw new Exception('La orden esta vacia', 400);

        $filename = sprintf('%08d.txt', $order->getId());

        $fileContent = sprintf("1;%08d\r\n", $order->getId());

        $fileContent .= sprintf("2;%d;%d\r\n", $customer->getZone(), $customer->getNumber());

        foreach ($items as $item) {
            $fileContent .= sprintf("3;%s;%.3f;;0.00;%.3f\r\n",
                $item->getProductCode(),
                $item->getQuantity(),
                $item->getPrice()
            );
        }

        $fileContent .= sprintf("4;%s\r\n", $order->getNote());

        $fileContent .= sprintf("5;%s\r\n", $order->getPaymentMethod());

        Response::append('filename', $filename);
        Response::append('csv', sprintf('data:text/csv;base64,%s', base64_encode($fileContent)));

        Response::setCode(200);
    }
}