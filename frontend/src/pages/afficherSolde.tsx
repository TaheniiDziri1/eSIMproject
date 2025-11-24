import { useEffect, useState } from "react";
import { getBalance } from "../services/walletService";
import Sidebar from "../components/Sidebar";


export default function SoldePage() {
    const [solde, setSolde] = useState<number | null>(null);

    useEffect(() => {
        getBalance().then(setSolde).catch(console.error);
    }, []);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
        <div>
        <h1 className="text-2xl font-bold">Votre solde</h1>
        <p className="mt-4 text-lg">
            Solde actuel : {solde !== null ? solde + " TND" : "Chargement..."}
        </p>
        </div>
        </div>
    );
}
