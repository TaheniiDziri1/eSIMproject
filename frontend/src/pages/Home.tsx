import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAvailableEsimPackages } from "../services/esimService";

export default function Home() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [packagesList, setPackagesList] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
        const data = await getAvailableEsimPackages();
        setPackagesList(data.packages || []); 
        }
        fetchData();
    }, []);

    return (
        <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ margin: "20px" }}>
            <h1>Hello {user.username}</h1>

            <h2>Available eSIM Packages</h2>
            <ul>
            {packagesList.map((pkg, i) => (
                <li key={i}>
                <b>{pkg.name}</b> — {pkg.description} — {pkg.price}$
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
}
