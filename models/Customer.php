<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class Customer implements JsonSerializable {
    /**
     * @var string
     */
    private string $dni;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var int
     */
    private int $zone;

    /**
     * @var int
     */
    private int $number;

    private int $price_list;


    /**
     * @param string $dni
     * @param string $name
     * @param int    $zone
     * @param int    $number
     */
    public function __construct(string $dni = '', string $name = '', int $zone = 0, int $number = 0, $price_list = 0) {
        $this->dni = $dni;
        $this->name = $name;
        $this->zone = $zone;
        $this->number = $number;
        $this->price_list = $price_list;
    }

    /**
     * @return string
     */
    public function getDni(): string {
        return $this->dni;
    }

    /**
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @return int
     */
    public function getZone(): int {
        return $this->zone;
    }

    /**
     * @return int
     */
    public function getNumber(): int {
        return $this->number;
    }

    public function getPriceList(): int {
        return $this->price_list;
    }

    /**
     * @param string $dni
     *
     * @return Customer
     */
    public function setDni(string $dni): Customer {
        $this->dni = $dni;
        return $this;
    }

    /**
     * @param string $name
     *
     * @return Customer
     */
    public function setName(string $name): Customer {
        $this->name = $name;
        return $this;
    }

    /**
     * @param int $zone
     *
     * @return Customer
     */
    public function setZone(int $zone): Customer {
        $this->zone = $zone;
        return $this;
    }

    /**
     * @param int $number
     *
     * @return Customer
     */
    public function setNumber(int $number): Customer {
        $this->number = $number;
        return $this;
    }

    public function setPriceList(int $price_list): Customer {
        $this->price_list = $price_list;
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
    public static function getCustomers(): array {
        $conn = Connection::getConn();

        $query = "SELECT dni, name, zone, number FROM customers ORDER BY name";

        $conn->real_query($query);

        $result = $conn->store_result();

        $customers = [];

        while (($row = $result->fetch_assoc())) {
            $customer = new Customer();
            $customer->setDni($row['dni']);
            $customer->setName($row['name']);
            $customer->setZone($row['zone']);
            $customer->setNumber($row['number']);
            $customers[] = $customer;
        }

        $result->free();

        return $customers;
    }

    /**
     * @param string $dni
     *
     * @return Customer|null
     */
    public static function getCustomer(string $dni): ?Customer {
        $conn = Connection::getConn();

        $query = "SELECT * FROM customers WHERE dni='%s'";

        $query = sprintf($query, $conn->escape_string($dni));

        $conn->real_query($query);

        $result = $conn->store_result();

        $customer = null;

        if (($row = $result->fetch_assoc())) {
            $customer = new Customer();
            $customer->setDni($row['dni']);
            $customer->setName($row['name']);
            $customer->setZone($row['zone']);
            $customer->setNumber($row['number']);
            $customer->setPriceList($row['price_list']);
        }

        $result->free();

        return $customer;
    }

    /**
     * @param Customer $customer
     *
     * @return void
     */
    public static function createCustomer(Customer $customer): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO customers (dni, name, zone, number, price_list) 
        VALUES ('%s', '%s', %d, %d, %d) 
        ON DUPLICATE KEY UPDATE name = '%s'";


        $query = sprintf($query,
            $conn->escape_string($customer->getDni()),
            $conn->escape_string($customer->getName()),
            $customer->getZone(),
            $customer->getNumber(),
            $customer->getPriceList(),
            $conn->escape_string($customer->getName())
        );

        $conn->real_query($query);
    }
}