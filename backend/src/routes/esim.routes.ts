import express from "express";
import { listPackages, orderEsim, finalizeEsimOrder } from "../controllers/esim.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Lister les packages eSIM disponibles
router.get("/packages", authMiddleware, listPackages);

// Commander une eSIM (reste pending)
router.post("/order", authMiddleware, orderEsim);

// Finaliser une commande eSIM (admin)
router.post("/order/finalize/:orderId", authMiddleware, finalizeEsimOrder);

export default router;
