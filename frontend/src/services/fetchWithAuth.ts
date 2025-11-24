// src/services/fetchWithAuth.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let token = localStorage.getItem("token");
    if (!token) throw new Error("Utilisateur non connecté");

    // Ajouter l'Authorization header
    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const res = await fetch(url, options);

    // Vérifier si le backend a renvoyé un nouveau token
    const newToken = res.headers.get("x-new-token");
    if (newToken) {
        localStorage.setItem("token", newToken);
        token = newToken; // mettre à jour la variable pour cette requête si besoin
    }

    // Lire la réponse
    const text = await res.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error("Réponse invalide du serveur");
    }

    if (!data.success) throw new Error(data.errorMsg || "Erreur serveur");

    return data;
}
