<?php

namespace models;

use helpers\Logger;
use JsonSerializable;

/**
 *
 */
class Product implements JsonSerializable
{
    /**
     * @var string
     */
    private string $code;

    /**
     * @var string
     */
    private string $description;

    /**
     * @var float
     */
    private float $price;

    /**
     * @var float
     */
    private float $price1;

    /**
     * @var float
     */
    private float $price2;

    /**
     * @var float
     */
    private float $price3;

    /**
     * @var float
     */
    private float $price4;

    /**
     * @var float
     */
    private float $price5;

    /**
     * @var float
     */
    private float $price6;

    /**
     * @var string
     */
    private string $categoryCode;

    /**
     * @var bool
     */
    private bool $featured;

    /**
     * @var int
     */
    private int $frequency;

    /**
     * @var ProductCategory|null
     */
    private ?ProductCategory $category;

    /**
     * @var ProductDetail|null
     */
    private ?ProductDetail $productDetail;

    /**
     * @var int
     */
    private int $stock;

    /**
     * @param string $code
     * @param string $description
     * @param float  $price
     * @param string $categoryCode
     * @param bool   $featured
     */
    public function __construct(string $code = '', string $description = '', float $price = 0.0, string $categoryCode = '', bool $featured = false)
    {
        $this->code = $code;
        $this->description = $description;
        $this->categoryCode = $categoryCode;
        $this->featured = $featured;
        $this->price = $price;
        $this->stock = 0;
        $this->frequency = 0;
        $this->category = null;
        $this->productDetail = null;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @return float
     */
    public function getPrice(): float
    {
        return $this->price;
    }

    /**
     * @return string
     */
    public function getCategoryCode(): string
    {
        return $this->categoryCode;
    }

    /**
     * @return int
     */
    public function getFrequency(): int
    {
        return $this->frequency;
    }

    /**
     * @return ProductCategory|null
     */
    public function getCategory(): ?ProductCategory
    {
        return $this->category;
    }

    /**
     * @return ProductDetail|null
     */
    public function getProductDetail(): ?ProductDetail
    {
        return $this->productDetail;
    }


    /**
     * @return float
     */
    public function getPrice1(): float
    {
        return $this->price1;
    }

    /**
     * @return float
     */
    public function getPrice2(): float
    {
        return $this->price2;
    }

    /**
     * @return float
     */
    public function getPrice3(): float
    {
        return $this->price3;
    }

    /**
     * @return float
     */
    public function getPrice4(): float
    {
        return $this->price4;
    }

    /**
     * @return float
     */
    public function getPrice5(): float
    {
        return $this->price5;
    }

    /**
     * @return float
     */
    public function getPrice6(): float
    {
        return $this->price6;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    /**
     * @return bool
     */
    public function isFeatured(): bool
    {
        return $this->featured;
    }

    /**
     * @param string $code
     *
     * @return $this
     */
    public function setCode(string $code): Product
    {
        $this->code = $code;
        return $this;
    }

    /**
     * @param string $description
     *
     * @return $this
     */
    public function setDescription(string $description): Product
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @param float $price
     *
     * @return $this
     */
    public function setPrice(float $price): Product
    {
        $this->price = $price;
        return $this;
    }

    public function setPrice1(float $price1): Product
    {
        $this->price1 = $price1;
        return $this;
    }

    /**
     * @param float $price2
     *
     * @return $this
     */
    public function setPrice2(float $price2): Product
    {
        $this->price2 = $price2;
        return $this;
    }

    /**
     * @param float $price3
     *
     * @return $this
     */
    public function setPrice3(float $price3): Product
    {
        $this->price3 = $price3;
        return $this;
    }

    /**
     * @param float $price4
     *
     * @return $this
     */
    public function setPrice4(float $price4): Product
    {
        $this->price4 = $price4;
        return $this;
    }

    /**
     * @param float $price5
     *
     * @return $this
     */
    public function setPrice5(float $price5): Product
    {
        $this->price5 = $price5;
        return $this;
    }

    /**
     * @param float $price6
     *
     * @return $this
     */
    public function setPrice6(float $price6): Product
    {
        $this->price6 = $price6;
        return $this;
    }

    public function setStock(float $stock): Product
    {
        $this->stock = $stock;
        return $this;
    }

    /**
     * @param string $categoryCode
     *
     * @return $this
     */
    public function setCategoryCode(string $categoryCode): Product
    {
        $this->categoryCode = $categoryCode;
        return $this;
    }

    /**
     * @param bool $featured
     *
     * @return Product
     */
    public function setFeatured(bool $featured): Product
    {
        $this->featured = $featured;
        return $this;
    }

    /**
     * @param int $frequency
     *
     * @return Product
     */
    public function setFrequency(int $frequency): Product
    {
        $this->frequency = $frequency;
        return $this;
    }

    /**
     * @param ProductCategory|null $category
     *
     * @return Product
     */
    public function setCategory(?ProductCategory $category): Product
    {
        $this->category = $category;
        return $this;
    }

    /**
     * @param ProductDetail|null $productDetail
     *
     * @return Product
     */
    public function setProductDetail(?ProductDetail $productDetail): Product
    {
        $this->productDetail = $productDetail;
        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }

    /**
     * @return array
     */
    public static function getProducts($price_list = 0, $featured = null): array
    {
        $conn = Connection::getConn();
        $user = Session::getCustomer();

        // Construir la lógica para determinar el precio más bajo válido
        $priceColumns = [];
        $priceField = '0';

        for ($i = $price_list; $i >= 1; $i--) {
            $priceColumns[] = "p.price_$i"; // Asegurar que cada columna esté completamente definida
        }

        if ($price_list) {
            $priceField = "COALESCE(" . implode(", ", $priceColumns) . ', p.price)';
        }
        
        if ($user instanceof User) {
            $priceField = 'p.price';
        }

        Logger::log('asd', $priceField);
        // Lógica para filtrar por 'featured'
        $featuredCondition = '';
        if ($featured) {
            $featuredCondition = "AND p.featured = 1";
        } elseif ($featured) {
            $featuredCondition = "AND p.featured = 0";
        }

        Logger::log('featureCondition', $featuredCondition);

        $query = "SELECT p.code,
                         p.description,
                         $priceField AS price,
                         p.category_code,
                         p.featured,
                         c.description AS category_description,
                         pd.image_path,
                         pd.additional_description,
                         SUM(i.quantity) AS frequency
                  FROM products p
                  LEFT JOIN product_categories c ON c.code = p.category_code
                  LEFT JOIN product_details pd ON p.code = pd.code
                  LEFT JOIN items i ON p.code = i.product_code
                  WHERE 1=1 $featuredCondition
                  GROUP BY p.code, c.description, p.description
                  ORDER BY c.description, p.description";

        $conn->real_query($query);
        $result = $conn->store_result();
        $products = [];

        while (($row = $result->fetch_assoc())) {
            $product = new Product();
            $product->setCode($row['code']);
            $product->setDescription($row['description']);

            // Validar el valor de price antes de asignarlo
            $price = $row['price'] !== null ? (float)$row['price'] : 0.0;
            $product->setPrice($price);

            $product->setCategoryCode($row['category_code']);
            $product->setFeatured($row['featured']);
            $product->setFrequency($row['frequency'] ?? 0);

            $productCategory = new ProductCategory();
            $productCategory->setCode($row['category_code']);
            $productCategory->setDescription($row['category_description']);

            $productDetail = new ProductDetail();
            $productDetail->setCode($row['code']);
            $productDetail->setAdditionalDescription($row['additional_description'] ?? '');
            $productDetail->setImagePath(empty($row['image_path']) ? 'public/images/default.png' : $row['image_path']);

            $product->setCategory($productCategory);
            $product->setProductDetail($productDetail);

            $products[] = $product;
        }

        $result->free();

        return $products;
    }

    /**
     * @param string $categoryCode
     *
     * @return array
     */
    public static function getProductsByCategoryCode(string $categoryCode, int $price_list = 0, $featured = null): array
    {
        $conn = Connection::getConn();

        $priceColumns = [];
        $priceField = '0';
        
        Logger::log('prie' , $price_list);
        for ($i = $price_list; $i >= 1; $i--) {
            $priceColumns[] = "p.price_$i"; // Asegurar que cada columna esté completamente definida
        }

        if ($price_list) {
            $priceField = "COALESCE(" . implode(", ", $priceColumns) . ', p.price)';
        }

        $featuredCondition = '';
        if ($featured) {
            $featuredCondition = "AND p.featured = 1";
        } elseif ($featured) {
            $featuredCondition = "AND p.featured = 0";
        }


        $query = "SELECT p.code,
       p.description,
       $priceField AS price,
       p.category_code,
       p.featured,
       c.description   category_description,
       pd.image_path,
       pd.additional_description,
       SUM(i.quantity) frequency
FROM products p
         LEFT JOIN product_categories c on c.code = p.category_code
         LEFT JOIN product_details pd on p.code = pd.code
         LEFT JOIN items i on p.code = i.product_code
WHERE p.category_code = '%s' AND 1=1 $featuredCondition
GROUP BY p.code, c.description, p.description
ORDER BY c.description, p.description";

        $conn->real_query(sprintf($query, $categoryCode));

        $result = $conn->store_result();

        $products = [];

        while (($row = $result->fetch_assoc())) {
            $product = new Product();
            $product->setCode($row['code']);
            $product->setDescription($row['description']);
            $price = $row['price'] !== null ? (float)$row['price'] : 0.0;
            $product->setPrice($price);
            $product->setCategoryCode($row['category_code']);
            $product->setFeatured($row['featured']);
            $product->setFrequency($row['frequency'] ?? 0);

            $productCategory = new ProductCategory();
            $productCategory->setCode($row['category_code']);
            $productCategory->setDescription($row['category_description']);

            $productDetail = new ProductDetail();
            $productDetail->setCode($row['code']);
            $productDetail->setAdditionalDescription($row['additional_description'] ?? '');
            $productDetail->setImagePath(empty($row['image_path']) ? 'public/images/default.png' : $row['image_path']);

            $product->setCategory($productCategory);
            $product->setProductDetail($productDetail);

            $products[] = $product;
        }

        $result->free();

        return $products;
    }

    /**
     * @param string $productCode
     *
     * @return Product|null
     */
    public static function getProduct(string $productCode): ?Product
    {
        $conn = Connection::getConn();

        $query = "SELECT p.code,
       p.description,
       p.price,
       p.category_code,
       p.featured,
       c.description   category_description,
       pd.image_path,
       pd.additional_description,
       SUM(i.quantity) frequency
FROM products p
         LEFT JOIN product_categories c on c.code = p.category_code
         LEFT JOIN product_details pd on p.code = pd.code
         LEFT JOIN items i on p.code = i.product_code
WHERE p.code = '%s'
GROUP BY p.code, p.description
ORDER BY p.description";

        $query = sprintf($query, $conn->escape_string($productCode));

        $conn->real_query($query);

        $result = $conn->store_result();

        $product = null;

        if (($row = $result->fetch_assoc())) {
            $product = new Product();
            $product->setCode($row['code']);
            $product->setDescription($row['description']);
            $product->setPrice($row['price']);
            $product->setCategoryCode($row['category_code']);
            $product->setFeatured($row['featured']);
            $product->setFrequency($row['frequency'] ?? 0);

            $productCategory = new ProductCategory();
            $productCategory->setCode($row['category_code']);
            $productCategory->setDescription($row['category_description']);

            $productDetail = new ProductDetail();
            $productDetail->setCode($row['code']);
            $productDetail->setAdditionalDescription($row['additional_description'] ?? '');
            $productDetail->setImagePath(empty($row['image_path']) ? 'public/images/default.png' : $row['image_path']);

            $product->setCategory($productCategory);
            $product->setProductDetail($productDetail);
        }

        $result->free();

        return $product;
    }

    /**
     * @param Product $product
     *
     * @return void
     */
    public static function createProduct(Product $product): void
    {
        $conn = Connection::getConn();
        $query = "INSERT INTO products (code, description, price, price_1, price_2, price_3, price_4, price_5, price_6, category_code, featured) VALUES ('%s', '%s', %f, %f, %f, %f, %f, %f, %f, '%s', %d)";

        $query = sprintf(
            $query,
            $conn->escape_string($product->getCode()),
            $conn->escape_string($product->getDescription()),
            $product->getPrice(),
            $product->getPrice1(),
            $product->getPrice2(),
            $product->getPrice3(),
            $product->getPrice4(),
            $product->getPrice5(),
            $product->getPrice6(),
            $conn->escape_string($product->getCategoryCode()),
            $product->isFeatured()
        );

        $conn->real_query($query);
    }
}
