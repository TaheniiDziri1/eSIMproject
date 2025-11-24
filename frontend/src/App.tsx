// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import RechargePage from "./pages/chargerCompte";
import SoldePage from "./pages/afficherSolde";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/packages" element={<Packages />} />   
        <Route path="/RechargePage" element={<RechargePage />} />   
        <Route path="/SoldePage" element={<SoldePage />} />   


      </Routes>
    </BrowserRouter>
  );
}
