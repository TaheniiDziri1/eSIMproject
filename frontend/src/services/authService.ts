// src/services/authService.ts
const API_URL = process.env.REACT_APP_API_URL + "/auth";


export interface AuthResponse {
    error?: string;
    token?: string;
    user?: any;
    }

    export async function signup(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });
    return res.json();
    
    }

    export async function signin(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}
