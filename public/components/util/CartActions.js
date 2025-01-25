export const getCart = async () => {
  const res = await fetch("/api/v1/cart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const addProduct = async (customer_dni, product, quantity) => {
  const item = {
    customer_dni,
    product_code: product.code,
    quantity,
  };

  const res = await fetch("/api/v1/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return await res.json();
};

export const deleteProduct = async (product_code) => {
  const res = await fetch(`/api/v1/cart/delete/${product_code}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const clearCart = async () => {
  const res = await fetch("/api/v1/cart/clear", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const updateProduct = async (updatedItem) => {
  const res = await fetch("/api/v1/cart/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedItem),
  });

  return await res.json();
};
