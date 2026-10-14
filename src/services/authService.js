const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async(email, password) => {

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error("Failed to login");
    }

    return response.json();
};

export const registerUser = async(name, email, password) => {

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
        throw new Error("Failed to register");
    }

    return response.json();
};
