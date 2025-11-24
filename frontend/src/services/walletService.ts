const API_URL = process.env.REACT_APP_API_URL + "/wallet";


export async function addBalance(amount: number) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");

    try {
        const res = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
        });

        const text = await res.text();
        console.log("Réponse raw /wallet/add :", text);

        const data = JSON.parse(text);

        if (!data.success) {
        throw new Error("Erreur API");
        }

        return data.balance;

    } catch (error) {
        console.error("Erreur addBalance:", error);
        throw error;
    }
    }

    export async function getBalance() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");

    try {
        const res = await fetch(`${API_URL}/balance`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        const text = await res.text();
        console.log("Réponse raw /wallet/balance :", text);

        const data = JSON.parse(text);

        if (!data.success) {
        throw new Error("Erreur API");
        }

        return data.balance;

    } catch (error) {
        console.error("Erreur getBalance:", error);
        throw error;
    }
}
