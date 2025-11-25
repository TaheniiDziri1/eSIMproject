import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null, 
    },
    tokenIssuedAt: { 
        type: Date,
        default: null,
    },
    tokenExpiresAt: { 
        type: Date,
        default: null,
    },
    refreshIssuedAt: {
        type: Date,
        default: null,
    },
    refreshExpiresAt: {
        type: Date,
        default: null,
    },
    resetToken: {
        type: String,
        default: null,
        required: false,
    },
    resetTokenExpires: {
        type: Date,
        default: null,
        required:false,
    },

}, { timestamps: true });

export default mongoose.model("Token", TokenSchema);
