<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class ProductCategory implements JsonSerializable {
    /**
     * @var string
     */
    private string $code;

    /**
     * @var string
     */
    private string $description;

    /**
     * @param string $code
     * @param string $description
     */
    public function __construct(string $code = '', string $description = '') {
        $this->code = $code;
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getCode(): string {
        return $this->code;
    }

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param string $code
     *
     * @return $this
     */
    public function setCode(string $code): ProductCategory {
        $this->code = $code;
        return $this;
    }

    /**
     * @param string $description
     *
     * @return $this
     */
    public function setDescription(string $description): ProductCategory {
        $this->description = $description;
        return $this;
    }

    /**
     * @param ProductCategory $category
     *
     * @return void
     */
    public static function createCategory(ProductCategory $category): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO product_categories (code, description) VALUES ('%s','%s')";

        $query = sprintf($query,
            $conn->escape_string($category->getCode()),
            $conn->escape_string($category->getDescription())
        );

        $conn->real_query($query);
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array {
        return get_object_vars($this);
    }
}