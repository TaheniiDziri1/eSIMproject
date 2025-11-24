import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addBalance, getBalance } from "../controllers/wallet.controller";

const router = express.Router();

// Ajouter de l'argent au wallet
router.post("/add", authMiddleware, addBalance);

// Consulter le solde du wallet
router.get("/balance", authMiddleware, getBalance);

export default router;
