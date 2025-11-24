// controllers/wallet.controller.ts
import { Request, Response } from "express";
import walletService from "../services/wallet.service";

export const addBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount } = req.body;
    const newBalance = await walletService.addBalance(userId, amount);
    res.json({ success: true, balance: newBalance });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const balance = await walletService.checkBalance(userId);
    res.json({ success: true, balance });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
