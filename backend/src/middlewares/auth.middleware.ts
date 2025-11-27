import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/AppError";
import Token from "../models/Token";

dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new AppError("Token manquant",401));
    }

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded: any = jwt.verify(token, secret);
        const tokenRecord = await Token.findOne({ userId: decoded.id });

        if (!tokenRecord || tokenRecord.token !== token) {
          return next(new AppError("Token non autorisé",401));
        }

        (req as any).user = decoded;
        next();
    }
    catch (err: any) {
      return next(new AppError("Token invalide ou expiré",401));    }
};
