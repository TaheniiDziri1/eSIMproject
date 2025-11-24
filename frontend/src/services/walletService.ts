import { fetchWithAuth } from "./fetchWithAuth";

const API_URL = process.env.REACT_APP_API_URL + "/wallet";

export async function addBalance(amount: number) {
    const data = await fetchWithAuth(`${API_URL}/add`, {
        method: "POST",
        body: JSON.stringify({ amount }),
    });
    return data.balance;
}

export async function getBalance() {
    const data = await fetchWithAuth(`${API_URL}/balance`, { method: "GET" });
    return data.balance;
}
