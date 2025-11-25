import mongoose from "mongoose";

const TokenSchema =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
        token: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    },
    // date de creation de token
    tokenIssuedAt:{ 
        type:Date,
        required:true,
    },
    //date d'expiration du token
    tokenExpiresAt:{ 
        type:Date,
        required:true,
    },

    refreshIssuedAt:{
        type:Date,
        required:true,
    },
    refreshExpiresAt:{
        type:Date,
        required:true,
    },
    //info navigateur ou device
    userAgent:{  
        type:String,
        default:""
    },
    //IP du client
    ipAddress:{ 
        type: String,
        default:""
    }
}, { timestamps: true });
export default mongoose.model("Token", TokenSchema);
