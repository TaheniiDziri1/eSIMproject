import axios from "axios";
import Esim from "../models/esims";
import Order, { IOrder } from "../models/orders";
import mongoose from "mongoose";
import walletService from "./wallet.service";

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
    const response = await axios.post(
      "https://api.esimaccess.com/api/v1/open/package/list",
      {},
      {
        headers: {
          "RT-AccessCode": process.env.ESIM_ACCESS_CODE,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async orderEsim(userId: string, packageCode: string, price: number): Promise<OrderEsimResponse> {
    price = Number(price);
    if (isNaN(price)) throw new Error("Prix invalide");

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
    if (!order) throw new Error("Commande introuvable");
    if (order.status !== "pending") throw new Error("Commande déjà finalisée");

    // Créer orderNo via eSIM Access
    const response = await axios.post(
      "https://api.esimaccess.com/api/v1/open/esim/order",
      {
        transactionId: order.transactionId,
        amount: order.price,
        packageInfoList: [{ packageCode: order.packageCode, count: 1, price: order.price }],
      },
      {
        headers: { "RT-AccessCode": process.env.ESIM_ACCESS_CODE, "Content-Type": "application/json" },
      }
    );

    if (!response.data.success) {
      await walletService.addBalance(order.user.toString(), order.price);
      order.status = "failed";
      await order.save();
      return { success: false, message: response.data.errorMessage, order };
    }

    const orderNo = response.data.obj.orderNo;
    order.orderNo = orderNo;
    await order.save();

    const queryResponse = await axios.post(
      "https://api.esimaccess.com/api/v1/open/esim/query",
      { orderNo },
      {
        headers: { "RT-AccessCode": process.env.ESIM_ACCESS_CODE, "Content-Type": "application/json" },
      }
    );

    const profile = queryResponse.data.obj.profileList[0];
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
  }
}

export default new EsimService();
