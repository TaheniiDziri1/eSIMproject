import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAvailableEsimPackages } from "../services/esimService";

type EsimPackage = {
    packageCode: string;
    name: string;
    description: string;
    price: number; // prix en cents USD
};

export default function Packages() {
    const [packagesList, setPackagesList] = useState<EsimPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Taux de conversion USD → TND 
    const USD_TO_TND = 3.3;

    useEffect(() => {
        async function fetchData() {
            try {
                const packages = await getAvailableEsimPackages();
                setPackagesList(packages);
            } catch (err: any) {
                setError(err.message || "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleOrder = async (pkg: EsimPackage) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Veuillez vous connecter d'abord.");
                return;
            }

            const res = await fetch("http://localhost:5000/api/esim/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    packageCode: pkg.packageCode,
                    price: pkg.price,
                }),
            });

            const data = await res.json();
            alert(data.message);

        } catch (err) {
            alert("Erreur lors de la commande.");
        }
    };

    const convertPriceToTND = (price: number) => {
        const usd = price / 100; // convertir cents USD → USD
        return (usd * USD_TO_TND).toFixed(2); // convertir USD → TND 
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ margin: "20px", width: "100%" }}>
                <h1>Available eSIM Packages</h1>

                {loading && <p>Chargement...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && packagesList.length === 0 && (
                    <p>Aucun package trouvé.</p>
                )}

                {!loading && !error && packagesList.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {packagesList.map((pkg, i) => (
                            <li
                                key={i}
                                onClick={() => handleOrder(pkg)}
                                style={{
                                    cursor: "pointer",
                                    padding: "15px",
                                    marginBottom: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    background: "#f8f8f8",
                                }}
                            >
                                <b>{pkg.name}</b> — {pkg.description}
                                <br />
                                <b style={{ color: "green" }}>
                                    {convertPriceToTND(pkg.price)} TND
                                </b>
                                <br />
                                <small style={{ color: "#555" }}>
                                    Cliquez ici pour commander
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
