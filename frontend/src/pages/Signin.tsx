import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin, AuthResponse } from "../services/authService";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); 

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res: AuthResponse = await signin(email, password);

        if (res.error) {
        setError(res.error);
        return;
        }

        localStorage.setItem("token", res.token || "");

        navigate("/home"); 
    };

    return (
        <div style={{ width: "300px", margin: "auto", paddingTop: "60px" }}>
        <h2>Signin</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <br /><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <br /><br />
            <button type="submit">Se connecter</button>
        </form>
        </div>
    );
}
