import Esim from "../models/esims";
import Order, { IOrder } from "../models/orders";
import mongoose from "mongoose";
import walletService from "./wallet.service";
import AppError from "../utils/AppError";
import esimAccessService from "./external/esimAccess.service";

export interface OrderEsimResponse {
  success: boolean;
  message: string;
  balance?: number;
  required?: number;
  order?: IOrder | null;
  esim?: any | null;
  orderNo?: string;
  transactionId?: string;
}

class EsimService {
  async getAvailablePackages() {
    return await esimAccessService.getAvailablePackages();
  }

  async orderEsim(userId: string, packageCode: string, price: number): Promise<OrderEsimResponse> {
    price = Number(price);
    if (isNaN(price)) throw new AppError("Prix invalide", 400);

    const balance = await walletService.checkBalance(userId);
    if (balance < price) {
      return { success: false, message: "Le solde est insuffisant", balance, required: price, order: null };
    }

    await walletService.deductBalance(userId, price);

    const transactionId = "txn_" + Date.now();
    const order = await Order.create({
      user: new mongoose.Types.ObjectId(userId),
      esim: null,
      status: "pending",
      price,
      packageCode,
      transactionId,
      orderNo: null,
    });

    return { success: true, message: "Commande enregistrée et en attente de validation", order, transactionId };
  }

  async finalizeOrder(orderId: string): Promise<OrderEsimResponse> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Commande introuvable", 404);
    if (order.status !== "pending") throw new AppError("Commande déjà finalisée", 400);

    try {
      // 1. Créer orderNo via API externe
      const resOrder = await esimAccessService.createOrder(order.transactionId, order.price, order.packageCode);

      if (!resOrder.success) {
        await walletService.addBalance(order.user.toString(), order.price);
        order.status = "failed";
        await order.save();
        return { success: false, message: resOrder.errorMessage, order };
      }

      const orderNo = resOrder.obj.orderNo;
      if (!orderNo) throw new AppError("orderNo manquant dans la réponse API", 500);

      order.orderNo = orderNo;
      await order.save();

      // 2. Query le profil eSIM
      const resQuery = await esimAccessService.queryOrder(orderNo);

      const profile = resQuery?.obj?.profileList?.[0];
      if (!profile) throw new AppError("Profil eSIM non trouvé", 500);

      // 3. Créer eSIM dans la base
      const esim = await Esim.create({
        user: order.user,
        iccid: profile.iccid,
        qrCodeUrl: profile.qrCodeUrl,
        packageCode: order.packageCode,
        status: "active",
      });

      order.esim = esim._id;
      order.status = "completed";
      await order.save();

      return { success: true, message: "Commande finalisée et eSIM activée", order, esim };
    } catch (err: any) {
      // rollback
      await walletService.addBalance(order.user.toString(), order.price);
      order.status = "failed";
      await order.save();
      throw new AppError(err.message || "Erreur lors de la finalisation de la commande", 500);
    }
  }
}

export default new EsimService();
