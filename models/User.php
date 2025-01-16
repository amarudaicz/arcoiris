<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class User implements JsonSerializable {
    /**
     * @var int
     */
    private int $id;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var string
     */
    private string $email;

    /**
     * @var string
     */
    private string $passwordHash;
    
    private int $price_list;

    /**
     * @param int    $id
     * @param string $name
     * @param string $email
     * @param string $passwordHash
     */
    public function __construct(int $id = 0, string $name = '', string $email = '', string $passwordHash = '') {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->price_list = 0;
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
    public function getName(): string {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getEmail(): string {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getPasswordHash(): string {
        return $this->passwordHash;
    }

    public function getPriceList(): int {
        return $this->price_list;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function setId(int $id): User {
        $this->id = $id;
        return $this;
    }

    /**
     * @param string $name
     *
     * @return $this
     */
    public function setName(string $name): User {
        $this->name = $name;
        return $this;
    }

    /**
     * @param string $email
     *
     * @return $this
     */
    public function setEmail(string $email): User {
        $this->email = $email;
        return $this;
    }

    /**
     * @param string $passwordHash
     *
     * @return $this
     */
    public function setPasswordHash(string $passwordHash): User {
        $this->passwordHash = $passwordHash;
        return $this;
    }

    public function setPriceList(int $price_list): User {
        $this->price_list = $price_list;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array {
        $obj = get_object_vars($this);

        unset($obj['passwordHash']);

        return $obj;
    }

    /**
     * @return array
     */
    public static function getUsers(): array {
        $conn = Connection::getConn();

        $query = "SELECT id, name, email, password_hash FROM users";

        $conn->real_query($query);

        $result = $conn->store_result();

        $users = [];

        while (($row = $result->fetch_assoc())) {
            $user = new User();
            $user->setId($row['id']);
            $user->setName($row['name']);
            $user->setEmail($row['email']);
            $user->setPasswordHash($row['password_hash']);

            $users[] = $user;
        }

        $result->free();

        return $users;
    }

    /**
     * @param string $email
     *
     * @return User|null
     */
    public static function getUserByEmail(string $email): ?User {
        $conn = Connection::getConn();

        $query = "SELECT id, name, email, password_hash FROM users WHERE email='%s'";

        $query = sprintf($query,
            $conn->escape_string($email)
        );

        $conn->real_query($query);

        $result = $conn->store_result();

        $user = null;

        while (($row = $result->fetch_assoc())) {
            $user = new User();
            $user->setId($row['id']);
            $user->setName($row['name']);
            $user->setEmail($row['email']);
            $user->setPasswordHash($row['password_hash']);
            $user->setPriceList(1);
        }

        $result->free();

        return $user;
    }

    /**
     * @param int $userId
     *
     * @return User|null
     */
    public static function getUserById(int $userId): ?User {
        $conn = Connection::getConn();

        $query = "SELECT id, name, email, password_hash FROM users WHERE id=%d";

        $query = sprintf($query,
            $userId
        );

        $conn->real_query($query);

        $result = $conn->store_result();

        $user = null;

        while (($row = $result->fetch_assoc())) {
            $user = new User();
            $user->setId($row['id']);
            $user->setName($row['name']);
            $user->setEmail($row['email']);
            $user->setPasswordHash($row['password_hash']);
        }

        $result->free();

        return $user;
    }

    /**
     * @param User $user
     *
     * @return void
     */
    public static function updateUser(User $user): void {
        $conn = Connection::getConn();

        $query = "UPDATE users SET name='%s', email='%s', password_hash='%s' WHERE id=%d";

        $query = sprintf($query,
            $conn->escape_string($user->getName()),
            $conn->escape_string($user->getEmail()),
            $conn->escape_string($user->getPasswordHash()),
            $user->getId()
        );

        $conn->real_query($query);
    }
}