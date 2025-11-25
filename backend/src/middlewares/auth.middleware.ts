import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Token from "../models/Token";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    try {
        const secret = process.env.JWT_SECRET || "secret";
        const decoded: any = jwt.verify(token, secret);
        const tokenRecord = await Token.findOne({ userId: decoded.id });

        if (!tokenRecord || tokenRecord.token !== token) {
            return res.status(401).json({ message: "Token non autorisé" });
        }

        (req as any).user = decoded;
        next();
    }
    catch (err: any) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
