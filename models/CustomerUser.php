<?php

namespace models;

/**
 *
 */
class CustomerUser {
    /**
     * @var string
     */
    private string $dni;

    /**
     * @var string
     */
    private string $passwordHash;

    /**
     * @param string $dni
     * @param string $passwordHash
     */
    public function __construct(string $dni = '', string $passwordHash = '') {
        $this->dni = $dni;
        $this->passwordHash = $passwordHash;
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
    public function getPasswordHash(): string {
        return $this->passwordHash;
    }

    /**
     * @param string $dni
     *
     * @return $this
     */
    public function setDni(string $dni): CustomerUser {
        $this->dni = $dni;
        return $this;
    }

    /**
     * @param string $passwordHash
     *
     * @return $this
     */
    public function setPasswordHash(string $passwordHash): CustomerUser {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    /**
     * @param string $dni
     *
     * @return CustomerUser|null
     */
    public static function getCustomerUser(string $dni): ?CustomerUser {
        $conn = Connection::getConn();

        $query = "SELECT dni, password_hash FROM customer_users WHERE dni='%s'";

        $query = sprintf($query,
            $conn->escape_string($dni)
        );

        $conn->real_query($query);

        $result = $conn->store_result();

        $customer = null;

        if (($row = $result->fetch_assoc())) {
            $customer = new CustomerUser();
            $customer->setDni($row['dni']);
            $customer->setPasswordHash($row['password_hash']);
        }

        $result->free();

        return $customer;
    }

    /**
     * @param CustomerUser $customerUser
     *
     * @return void
     */
    public static function createCustomerUser(CustomerUser $customerUser): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO customer_users (dni, password_hash) VALUES ('%s','%s')";

        $query = sprintf($query,
            $conn->escape_string($customerUser->getDni()),
            $conn->escape_string($customerUser->getPasswordHash())
        );

        $conn->real_query($query);
    }

    /**
     * @param CustomerUser $customerUser
     *
     * @return void
     */
    public static function updateCustomerUser(CustomerUser $customerUser): void {
        $conn = Connection::getConn();

        $query = "UPDATE customer_users SET password_hash='%s' WHERE dni='%s'";

        $query = sprintf($query,
            $conn->escape_string($customerUser->getPasswordHash()),
            $conn->escape_string($customerUser->getDni())
        );

        $conn->real_query($query);
    }
}