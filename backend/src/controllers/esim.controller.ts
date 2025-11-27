import { Request, Response,NextFunction } from "express";
import esimService from "../services/esim.service";
import AppError from "../utils/AppError";

// LIST PACKAGES
export const listPackages = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const data = await esimService.getAvailablePackages();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ORDER ESIM
export const orderEsim = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { packageCode, price } = req.body;

    if (!packageCode || !price)
      throw new AppError("packageCode et price sont requis",400);

    const data = await esimService.orderEsim(userId, packageCode, price);
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

// FINALIZE ORDER (admin)
export const finalizeEsimOrder = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { orderId } = req.params;
    const data = await esimService.finalizeOrder(orderId);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
