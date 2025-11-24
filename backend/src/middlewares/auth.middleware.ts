import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const secret = (process.env.JWT_SECRET || "secret") as string;
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
