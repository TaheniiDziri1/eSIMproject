const API_URL = process.env.REACT_APP_API_URL + "/esim";

export async function getAvailableEsimPackages() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token non trouvé. Connectez-vous d'abord.");
    }

    try {
        const res = await fetch(`${API_URL}/packages`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        });

    const text = await res.text();
    console.log("Réponse brute du backend :", text);

    const data = JSON.parse(text);

        if (!data.success) {
        throw new Error(data.errorMsg || "Erreur serveur");
        }

        // Retourne la liste des packages
        return data.obj.packageList || [];
    } catch (err: any) {
        console.error("Erreur lors du fetch des packages :", err.message);
        throw err;
    }
}
