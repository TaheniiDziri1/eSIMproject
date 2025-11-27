import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
username: string;
email: string;
password: string;
balance: number;
isActive:boolean;

}

const UserSchema: Schema = new Schema(
{
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true,select:false },
    balance: { type: Number, default: 0 }, 
    isActive:{type:Boolean,default:false},
    
},
{ timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);

