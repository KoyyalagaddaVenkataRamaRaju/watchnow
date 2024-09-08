import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await axios.post('http://localhost:5001/register', { name, email, password });
            if (result.data === "Success") {
                navigate('/login');
            } else {
                setError(typeof result.data === 'string' ? result.data : result.data.message);
            }
        } catch (err) {
            console.log('Frontend Error:', err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-register">
            <div className="box-register">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="name">
                            <strong>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="sub-btn" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p>Already Have an Account?</p>
                <Link to="/login" className="next-btn">
                    Signin
                </Link>
            </div>
        </div>
    );
}

export default Register;
