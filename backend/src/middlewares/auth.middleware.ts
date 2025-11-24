import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authService from "../services/auth.service";

dotenv.config();

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const secret = (process.env.JWT_SECRET || "secret") as string;
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (err:any) {
    //token expire , on essaye de régénérer
    if(err.name === "TokenExpiredError"){
      try{
        const data = await authService.refreshToken(token);
        res.setHeader("x-new-token",data.token);
        const decodedNew = jwt.verify(data.token, process.env.JWT_SECRET || "secret");
        (req as any).user = decodedNew;
        next();
      }catch{
        return res.status(401).json({ message: "Token expiré et invalide" });
      }
    }
    else{
        return res.status(401).json({ message: "Token invalide" });

    }
  }
};
