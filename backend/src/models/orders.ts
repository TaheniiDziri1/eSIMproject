// Contient chaque commande passée par un utilisateur
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    esim: mongoose.Types.ObjectId | null;
    status: string;
    price: number;
    packageCode: string;
    transactionId: string;
    orderNo: string | null;
    createdAt?: Date;
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    esim: { type: Schema.Types.ObjectId, ref: "Esim", default: null },

    status: { type: String, required: true, default: "pending" },

    price: { type: Number, required: true },
    packageCode: { type: String, required: true },
    transactionId: { type: String, required: true },
    orderNo: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
