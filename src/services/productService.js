const API_URL = "http://localhost:8080/api/products";

const authenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const responseMessage = await response.text();
        throw new Error(responseMessage || `Request failed (${response.status})`);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : response.text();
};

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/getAll`);

    if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
    }

    return response.json();
};

export const createProduct = (product) =>
    authenticatedRequest(API_URL, {
        method: "POST",
        body: JSON.stringify(product),
    });

export const updateProduct = (id, product) =>
    authenticatedRequest(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });

export const deleteProduct = (id) =>
    authenticatedRequest(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });