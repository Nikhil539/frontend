import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const data = await loginUser(email, password);
            login(data);
            navigate(data.role === "ADMIN" ? "/admin" : "/products");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="login-page">
            <div className="login-card">
                <div className="login-mark" aria-hidden="true">M</div>
                <p className="login-eyebrow">WELCOME BACK</p>
                <h1>Log in to your account</h1>
                <p className="login-description">Pick up where you left off and find something you'll love.</p>

                {error && <p className="login-error" role="alert">{error}</p>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
                <p className="login-footnote">Your account details are securely protected.</p>
            </div>
        </section>
    );
}

export default Login;