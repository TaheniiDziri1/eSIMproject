//Contient les eSIM que chaque utilisateur a achetées
import mongoose , {Schema, Document} from "mongoose";

export interface IEsim extends Document {
    user : mongoose.Types.ObjectId;
    iccid :string;
    packageCode :string;
    status:string;
    qrCodeUrl?: string;            
    createdAt?: Date;
    updatedAt?: Date;
}

const EsimSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    iccid: { type: String, required: true, unique: true },
    packageCode: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    qrCodeUrl: { type: String },
}, { timestamps: true });

export default mongoose.model<IEsim>("Esim", EsimSchema);