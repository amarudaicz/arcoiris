<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class Item implements JsonSerializable {
    /**
     * @var int
     */
    private int $number;

    /**
     * @var string
     */
    private string $description;

    /**
     * @var float
     */
    private float $price;

    /**
     * @var int
     */
    private int $quantity;

    /**
     * @var string
     */
    private string $productCode;

    /**
     * @var int
     */
    private int $orderId;

    /**
     * @param int    $number
     * @param string $description
     * @param float  $price
     * @param int    $quantity
     * @param string $productCode
     * @param int    $orderId
     */
    public function __construct(int $number = 0, string $description = '', float $price = 0.0, int $quantity = 0, string $productCode = '', int $orderId = 0) {
        $this->number = $number;
        $this->description = $description;
        $this->price = $price;
        $this->quantity = $quantity;
        $this->productCode = $productCode;
        $this->orderId = $orderId;
    }

    /**
     * @return int
     */
    public function getNumber(): int {
        return $this->number;
    }

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @return float
     */
    public function getPrice(): float {
        return $this->price;
    }

    /**
     * @return int
     */
    public function getQuantity(): int {
        return $this->quantity;
    }

    /**
     * @return string
     */
    public function getProductCode(): string {
        return $this->productCode;
    }

    /**
     * @return int
     */
    public function getOrderId(): int {
        return $this->orderId;
    }

    /**
     * @param int $number
     *
     * @return $this
     */
    public function setNumber(int $number): Item {
        $this->number = $number;
        return $this;
    }

    /**
     * @param string $description
     *
     * @return $this
     */
    public function setDescription(string $description): Item {
        $this->description = $description;
        return $this;
    }

    /**
     * @param float $price
     *
     * @return $this
     */
    public function setPrice(float $price): Item {
        $this->price = $price;
        return $this;
    }

    /**
     * @param int $quantity
     *
     * @return $this
     */
    public function setQuantity(int $quantity): Item {
        $this->quantity = $quantity;
        return $this;
    }

    /**
     * @param string $productCode
     *
     * @return $this
     */
    public function setProductCode(string $productCode): Item {
        $this->productCode = $productCode;
        return $this;
    }

    /**
     * @param int $orderId
     *
     * @return $this
     */
    public function setOrderId(int $orderId): Item {
        $this->orderId = $orderId;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array {
        return get_object_vars($this);
    }

    /**
     * @param int $oderId
     *
     * @return array
     */
    public static function getItems(int $oderId): array {
        $conn = Connection::getConn();

        $query = "SELECT number,
       description,
       price,
       quantity,
       product_code,
       order_id
FROM items
WHERE order_id = %d";

        $query = sprintf($query,
            $oderId
        );

        $conn->real_query($query);

        $result = $conn->store_result();

        $items = [];

        while (($row = $result->fetch_assoc())) {
            $item = new Item();
            $item->setNumber($row['number']);
            $item->setDescription($row['description']);
            $item->setPrice($row['price']);
            $item->setQuantity($row['quantity']);
            $item->setProductCode($row['product_code']);
            $item->setOrderId($row['order_id']);

            $items[] = $item;
        }

        $result->free();

        return $items;
    }

    /**
     * @param Item $item
     *
     * @return void
     */
    public static function createItem(Item $item): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO items (number, description, price, quantity, product_code, order_id)
VALUES (%d, '%s', %f, %d, '%s', %d)";

        $query = sprintf($query,
            $item->getNumber(),
            $conn->escape_string($item->getDescription()),
            $item->getPrice(),
            $item->getQuantity(),
            $conn->escape_string($item->getProductCode()),
            $item->getOrderId()
        );

        $conn->real_query($query);
    }
}