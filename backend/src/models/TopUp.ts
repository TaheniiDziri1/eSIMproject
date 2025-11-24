//Contient les recharges effectuées sur les eSIM
import mongoose,{Schema, Document} from "mongoose";

export interface ITopUp extends Document {
    esim:mongoose.Types.ObjectId,
    packageCode:string;
    amount:number;
    createdAt?: Date;
}

const TopUpSchema:Schema =new Schema({
    esim:{type:Schema.Types.ObjectId, ref:"Esim", required:true},
    packageCode: { type: String, required: true },
    amount: { type: Number, required: true },
},{timestamps:true});

export default mongoose.model<ITopUp>("TopUp",TopUpSchema);