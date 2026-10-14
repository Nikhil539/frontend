
const API_BASE_URL = "http://localhost:8080/api/orders";

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please log in before placing an order.");
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// Place a new order
export async function createOrder(items) {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to place order.");
    }

    return response.json();
}

// Fetch orders belonging to the logged-in user
export async function getMyOrders() {
    const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to fetch orders.");
    }

    return response.json();
}

// Cancel an order belonging to the logged-in user
export async function cancelOrder(orderId) {
    const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(orderId)}/cancel`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to cancel order.");
    }

    return response.json();
}
