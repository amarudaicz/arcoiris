<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class Order implements JsonSerializable {
    /**
     * @var int
     */
    private int $id;

    /**
     * @var string
     */
    private string $createdDate;

    /**
     * @var string
     */
    private string $paymentMethod;

    /**
     * @var string
     */
    private string $note;

    /**
     * @var string
     */
    private string $customerDni;

    /**
     * @var float
     */
    public float $total = 0.0;

    /**
     * @var string
     */
    public string $customerName = '';

    /**
     * @param int    $id
     * @param string $createdDate
     * @param string $paymentMethod
     * @param string $note
     * @param string $customerDni
     */
    public function __construct(int $id = 0, string $createdDate = '', string $paymentMethod = '', string $note = '', string $customerDni = '') {
        $this->id = $id;
        $this->createdDate = $createdDate;
        $this->paymentMethod = $paymentMethod;
        $this->note = $note;
        $this->customerDni = $customerDni;
    }

    /**
     * @return int
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getCreatedDate(): string {
        return $this->createdDate;
    }

    /**
     * @return string
     */
    public function getPaymentMethod(): string {
        return $this->paymentMethod;
    }

    /**
     * @return string
     */
    public function getNote(): string {
        return $this->note;
    }

    /**
     * @return string
     */
    public function getCustomerDni(): string {
        return $this->customerDni;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function setId(int $id): Order {
        $this->id = $id;
        return $this;
    }

    /**
     * @param string $createdDate
     *
     * @return $this
     */
    public function setCreatedDate(string $createdDate): Order {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * @param string $paymentMethod
     *
     * @return $this
     */
    public function setPaymentMethod(string $paymentMethod): Order {
        $this->paymentMethod = $paymentMethod;
        return $this;
    }

    /**
     * @param string $note
     *
     * @return $this
     */
    public function setNote(string $note): Order {
        $this->note = $note;
        return $this;
    }

    /**
     * @param string $customerDni
     *
     * @return $this
     */
    public function setCustomerDni(string $customerDni): Order {
        $this->customerDni = $customerDni;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array {
        return get_object_vars($this);
    }

    /**
     * @return array
     */
    public static function getOrders(): array {
        $conn = Connection::getConn();

        $query = "SELECT o.id,
       o.created_date,
       o.payment_method,
       o.note,
       o.customer_dni,
       COALESCE(c.name,'Cliente eliminado')   customer_name,
       COALESCE(SUM(i.price * i.quantity), 0) total
         FROM orders o
         LEFT JOIN items i on o.id = i.order_id
         LEFT JOIN customers c on c.dni = o.customer_dni
GROUP BY o.id
ORDER BY o.id DESC
LIMIT 50";

        $conn->real_query($query);

        $result = $conn->store_result();

        $orders = [];

        while (($row = $result->fetch_assoc())) {
            $order = new Order();
            $order->setId($row['id']);
            $order->setCreatedDate($row['created_date']);
            $order->setPaymentMethod($row['payment_method']);
            $order->setNote($row['note']);
            $order->setCustomerDni($row['customer_dni']);

            $order->total = $row['total'];
            $order->customerName = $row['customer_name'];

            $orders[] = $order;
        }

        $result->free();

        return $orders;
    }

    /**
     * @param string $from
     * @param string $to
     *
     * @return array
     */
    public static function getOrdersByDate(string $from, string $to): array {
        $conn = Connection::getConn();

        $query = "SELECT o.id,
       o.created_date,
       o.payment_method,
       o.note,
       o.customer_dni,
       COALESCE(c.name,'Cliente eliminado')   customer_name,
       COALESCE(SUM(i.price * i.quantity), 0) total
FROM orders o
         LEFT JOIN items i on o.id = i.order_id
         LEFT JOIN customers c on c.dni = o.customer_dni
WHERE DATE(o.created_date) BETWEEN '%s' AND '%s'
GROUP BY o.id
ORDER BY o.id DESC
LIMIT 50";

        $query = sprintf($query,
            $conn->escape_string($from),
            $conn->escape_string($to)
        );

        $conn->real_query($query);

        $result = $conn->store_result();

        $orders = [];

        while (($row = $result->fetch_assoc())) {
            $order = new Order();
            $order->setId($row['id']);
            $order->setCreatedDate($row['created_date']);
            $order->setPaymentMethod($row['payment_method']);
            $order->setNote($row['note']);
            $order->setCustomerDni($row['customer_dni']);

            $order->total = $row['total'];
            $order->customerName = $row['customer_name'];

            $orders[] = $order;
        }

        $result->free();

        return $orders;
    }

    /**
     * @param int $orderId
     *
     * @return Order|null
     */
    public static function getOrder(int $orderId): ?Order {
        $conn = Connection::getConn();

        $query = "SELECT o.id,
       o.created_date,
       o.payment_method,
       o.note,
       o.customer_dni,
       COALESCE(c.name,'Cliente eliminado')   customer_name,
       COALESCE(SUM(i.price * i.quantity), 0) total
         FROM orders o
         LEFT JOIN items i on o.id = i.order_id
         LEFT JOIN customers c on c.dni = o.customer_dni
WHERE o.id = %d
GROUP BY o.id
ORDER BY o.id DESC
LIMIT 50";

        $query = sprintf($query, $orderId);

        $conn->real_query($query);

        $result = $conn->store_result();

        $order = null;

        if (($row = $result->fetch_assoc())) {
            $order = new Order();
            $order->setId($row['id']);
            $order->setCreatedDate($row['created_date']);
            $order->setPaymentMethod($row['payment_method']);
            $order->setNote($row['note']);
            $order->setCustomerDni($row['customer_dni']);

            $order->total = $row['total'];
            $order->customerName = $row['customer_name'];
        }

        $result->free();

        return $order;
    }

    /**
     * @param Order $order
     *
     * @return void
     */
    public static function createOrder(Order $order): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO orders (created_date, payment_method, note, customer_dni) VALUES (NOW(), '%s', '%s', '%s')";

        $query = sprintf($query,
            $conn->escape_string($order->getPaymentMethod()),
            $conn->escape_string($order->getNote()),
            $conn->escape_string($order->getCustomerDni())
        );

        $conn->real_query($query);

        $order->setId($conn->insert_id);
    }
}