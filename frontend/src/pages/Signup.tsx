import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await signup(username, email, password);
        if (res.error) {
        setError(res.error);
        } else {
        navigate("/signin");
        }
    };

    return (
        <div style={{ width: "300px", margin: "auto", paddingTop: "60px" }}>
        <h2>Signup</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <br /><br />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <br /><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <br /><br />
            <button type="submit">Créer un compte</button>
        </form>
        </div>
    );
}
