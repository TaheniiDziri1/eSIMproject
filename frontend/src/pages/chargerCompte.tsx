import { useState } from "react";
import { addBalance } from "../services/walletService";
import Sidebar from "../components/Sidebar";


export default function RechargePage() {
    const [amount, setAmount] = useState(0);

    const handleRecharge = async () => {
        try {
        const newBalance = await addBalance(amount);
        alert("Solde mis à jour : " + newBalance + " TND");
        } catch (err: any) {
        alert(err.message);
        }
    };

    return (
    <div style={{ display: "flex" }}>
                <Sidebar />
        <div>
        <h1 className="text-xl font-bold">Charger votre compte</h1>

        <input
            type="number"
            className="border p-2 mt-4"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Montant"
        />

        <button
            onClick={handleRecharge}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
            Charger
        </button>
        </div>
        </div>
    );
}
