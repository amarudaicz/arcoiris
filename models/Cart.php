<?php

namespace models;

use Exception;
use helpers\Logger;
use JsonSerializable;

/**
 *
 */
class Cart implements JsonSerializable
{
    /**
     * @var string
     */
    private string $customer_dni;

    private array $items;

    public function __construct()
    {
        $this->items = [];
    }

    public function jsonSerialize(): mixed
    {
        return [
            'items' => $this->items,
            'customer_dni' => $this->customer_dni
        ];
    }

    public function setCustomerDni(string $dni): void
    {
        $this->customer_dni = $dni;
    }

    public function getCustomerDni(): string
    {
        return $this->customer_dni;
    }

    public function setItems(array $items): void
    {
        $this->items = $items;
    }

    public function getItems(): array
    {
        return $this->items;
    }


    public static function getCartByCode(string $customer_dni, $price_list)
    {
        $conn = Connection::getConn();

        $priceColumns = [];

        for ($i = $price_list; $i >= 1; $i--) {
            $priceColumns[] = "p.price_$i";
        }

        $priceField = $price_list
            ? "COALESCE(" . implode(", ", $priceColumns) . ", p.price)"
            : "p.price";

        $query = "SELECT 
            c.id,
            c.quantity,
            $priceField AS price,
            p.code AS productCode,
            p.description AS description,
            pd.image_path AS image
        FROM cart c
        LEFT JOIN products p ON c.product_code = p.code
        LEFT JOIN product_details pd ON p.code = pd.code
        WHERE c.customer_dni = ?
    ";

        // Preparar y ejecutar la consulta
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Error preparing statement: " . $conn->error);
        }

        $stmt->bind_param('s', $customer_dni);
        $stmt->execute();

        $result = $stmt->get_result();
        $items = $result->fetch_all(MYSQLI_ASSOC);

        $cart = new Cart();
        $cart->setCustomerDni($customer_dni);
        $cart->setItems($items);

        $stmt->close();
        return $cart;
    }

    public static function addItem(string $customer_dni, string $product_code, int $quantity): bool
    {
        $conn = Connection::getConn();

        $query = 'INSERT INTO cart (customer_dni, product_code, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY  UPDATE
        quantity = quantity + VALUES(quantity)
    ';
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ssi', $customer_dni, $product_code, $quantity); // 'ssi' porque quantity es entero.

        $success = $stmt->execute(); // Devuelve true si la consulta se ejecuta correctamente.

        $stmt->close();

        return $success; // Retorna true o false basado en el éxito de la consulta.
    }

    public static function deleteItem(int $id): bool
    {
        $conn = Connection::getConn();

        $query = 'DELETE FROM cart WHERE id = ?';

        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $id); // Cambié a 'i' porque $id es un entero.
        $stmt->execute();

        // Verificar si se afectó alguna fila
        $affectedRows = $stmt->affected_rows;

        Logger::log('Rows affected:', $affectedRows);

        $stmt->close();

        // Retornar true si se eliminó alguna fila, false en caso contrario
        return $affectedRows > 0;
    }

    public static function clearCart(int $customer_dni): bool
    {
        $conn = Connection::getConn();

        $query = 'DELETE FROM cart WHERE customer_dni = ?';

        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $customer_dni); // Cambié a 'i' porque $id es un entero.
        $stmt->execute();

        // Verificar si se afectó alguna fila
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
        // Retornar true si se eliminó alguna fila, false en caso contrario
        return $affectedRows > 0;
    }


    public static function updateItem(string $id, int $quantity): bool
    {
        $conn = Connection::getConn();

        $query = 'UPDATE cart SET quantity = ? WHERE id = ?;';

        Logger::log('Request:', $id);

        $stmt = $conn->prepare($query);
        $stmt->bind_param('is', $quantity, $id); // 'ssi' porque quantity es entero.

        $success = $stmt->execute(); // Devuelve true si la consulta se ejecuta correctamente.

        $stmt->close();

        return $success; // Retorna true o false basado en el éxito de la consulta.
    }
}
