import { Request, Response } from "express";
import esimService from "../services/esim.service";

// LIST PACKAGES
export const listPackages = async (req: Request, res: Response) => {
  try {
    const data = await esimService.getAvailablePackages();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ORDER ESIM
export const orderEsim = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { packageCode, price } = req.body;

    if (!packageCode || !price)
      return res.status(400).json({ success: false, message: "packageCode et price sont requis" });

    const data = await esimService.orderEsim(userId, packageCode, price);
    return res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// FINALIZE ORDER (admin)
export const finalizeEsimOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const data = await esimService.finalizeOrder(orderId);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
