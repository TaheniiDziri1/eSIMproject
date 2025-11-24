import { Request, Response } from "express";

export const getProfile = (req: Request, res: Response) => {
  res.json({
    message: "Profil de l'utilisateur connecté",
    user: (req as any).user,
  });
};
