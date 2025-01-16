<?php

namespace models;

use JsonSerializable;

/**
 *
 */
class ProductDetail implements JsonSerializable {
    /**
     * @var string
     */
    private string $code;

    /**
     * @var string
     */
    private string $imagePath;

    /**
     * @var string
     */
    private string $additionalDescription;

    /**
     * @param string $code
     * @param string $imagePath
     * @param string $additionalDescription
     */
    public function __construct(string $code = '', string $imagePath = '', string $additionalDescription = '') {
        $this->code = $code;
        $this->imagePath = $imagePath;
        $this->additionalDescription = $additionalDescription;
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
    public function getImagePath(): string {
        return $this->imagePath;
    }

    /**
     * @return string
     */
    public function getAdditionalDescription(): string {
        return $this->additionalDescription;
    }

    /**
     * @param string $code
     *
     * @return ProductDetail
     */
    public function setCode(string $code): ProductDetail {
        $this->code = $code;
        return $this;
    }

    /**
     * @param string $imagePath
     *
     * @return ProductDetail
     */
    public function setImagePath(string $imagePath): ProductDetail {
        $this->imagePath = $imagePath;
        return $this;
    }

    /**
     * @param string $additionalDescription
     *
     * @return ProductDetail
     */
    public function setAdditionalDescription(string $additionalDescription): ProductDetail {
        $this->additionalDescription = $additionalDescription;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array {
        return get_object_vars($this);
    }

    /**
     * @param string $productCode
     *
     * @return ProductDetail|null
     */
    public static function getByCode(string $productCode): ?ProductDetail {
        $conn = Connection::getConn();

        $query = "SELECT code, image_path, additional_description FROM product_details WHERE code='%s'";

        $query = sprintf($query, $conn->escape_string($productCode));

        $conn->real_query($query);

        $result = $conn->store_result();

        $productDetail = null;

        if (($row = $result->fetch_assoc())) {
            $productDetail = new ProductDetail();
            $productDetail->setCode($row['code']);
            $productDetail->setImagePath($row['image_path']);
            $productDetail->setAdditionalDescription($row['additional_description']);
        }

        $result->free();

        return $productDetail;
    }

    /**
     * @param ProductDetail $productDetail
     *
     * @return void
     */
    public static function createProductDetail(ProductDetail $productDetail): void {
        $conn = Connection::getConn();

        $query = "INSERT INTO product_details (code, image_path, additional_description) VALUES ('%s','%s','%s')";

        $query = sprintf($query,
            $conn->escape_string($productDetail->getCode()),
            $conn->escape_string($productDetail->getImagePath()),
            $conn->escape_string($productDetail->getAdditionalDescription())
        );

        $conn->real_query($query);
    }

    /**
     * @param ProductDetail $productDetail
     *
     * @return void
     */
    public static function updateProductDetail(ProductDetail $productDetail): void {
        $conn = Connection::getConn();

        $query = "UPDATE product_details SET image_path='%s', additional_description='%s' WHERE code='%s'";

        $query = sprintf($query,
            $conn->escape_string($productDetail->getImagePath()),
            $conn->escape_string($productDetail->getAdditionalDescription()),
            $conn->escape_string($productDetail->getCode())
        );

        $conn->real_query($query);
    }
}