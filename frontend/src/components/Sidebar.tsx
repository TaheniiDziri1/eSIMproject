import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; 

export default function Sidebar() {
    return (
        <div className="sidebar">
        <h3 className="title">Menu</h3>
        <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/packages">eSIM Packages</Link></li>
            <li><Link to="/RechargePage">Charger compte</Link></li>
            <li><Link to="/SoldePage">Voir solde</Link></li>
        </ul>
        </div>
    );
}
