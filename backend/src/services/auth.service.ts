import User from "../models/User";
import Token from "../models/Token";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { generateTokens } from "../utils/jwt.util";
import AppError from "../utils/AppError";
import crypto from "crypto";
import dayjs from "dayjs";

class AuthService {
    async signup(username: string, email: string, password: string) {
        if (!username || username.trim() === "") 
            throw new AppError("Nom d'utilisateur requis", 400);

        if (!validator.isEmail(email)) 
            throw new AppError("Email invalide", 400);

        const isPasswordValid = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });

        if (!isPasswordValid) {
            throw new AppError(
                "Mot de passe trop faible : il doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole",
                400
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) 
            throw new AppError("Email déjà utilisé", 409);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return user;
    }

    async signin(email: string, password: string) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) 
            throw new AppError("Utilisateur introuvable", 404);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) 
            throw new AppError("Mot de passe incorrect", 401);

        const {
            token,
            refreshToken,
            tokenIssuedAt,
            tokenExpiresAt,
            refreshIssuedAt,
            refreshExpiresAt,
        } = generateTokens(user._id, user.email);

        await Token.findOneAndUpdate(
            { userId: user._id },
            {
                token,
                refreshToken,
                tokenIssuedAt,
                tokenExpiresAt,
                refreshIssuedAt,
                refreshExpiresAt,
            },
            { upsert: true, new: true }
        );

        const { password: _, ...userData } = user.toObject();

        return {
            user: userData,
            token,
            refreshToken,
        };
    }

    async refreshToken(oldRefresh: string) {
        const savedToken = await Token.findOne({ refreshToken: oldRefresh });
        if (!savedToken) 
            throw new AppError("Refresh token invalide", 401);

        let decoded: any;
        try {
            decoded = jwt.verify(oldRefresh, process.env.JWT_REFRESH_SECRET!);
        } catch (err) {
            throw new AppError("Refresh token invalide ou expiré", 401);
        }

        const {
            token,
            refreshToken,
            tokenIssuedAt,
            tokenExpiresAt,
            refreshIssuedAt,
            refreshExpiresAt,
        } = generateTokens(decoded.id);

        savedToken.token = token;
        savedToken.refreshToken = refreshToken;
        savedToken.tokenIssuedAt = tokenIssuedAt;
        savedToken.tokenExpiresAt = tokenExpiresAt;
        savedToken.refreshIssuedAt = refreshIssuedAt;
        savedToken.refreshExpiresAt = refreshExpiresAt;

        await savedToken.save();

        return { token, refreshToken };
    }
    async requestPasswordReset(email:string){
        const user = await User.findOne({email});
        if(!user) throw new Error("utilisateur non trouvé");
        //Génerer un token de réiniialisation 

        const resetToken =crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = dayjs().add(1,"hour").toDate();
        //sauvgarder token
        await Token.findOneAndUpdate(
            {userId:user._id},
            {resetToken,resetTokenExpires},
            {upsert:true,new:true}
        );
        return {resetToken};
    };
    async resetPassword(resetToken:string, newPassword:string){
        const tokenData = await Token.findOne({resetToken});
        if(!tokenData) throw new Error ("token invalide ou expiré");

        if(!tokenData.resetTokenExpires ||tokenData.resetTokenExpires < new Date()){
            throw new Error("le token de réinitialisation a expiré");
        }

        const user = await User.findById(tokenData.userId);
        if(!user) throw new Error("utilisateur introuvable");
        const isStrong = validator.isStrongPassword(newPassword,{
                        minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,

        })
        if(!isStrong) throw new Error ("Mot de passe trop faible : il doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole");
        const hashedNewPassword = await bcrypt.hash(newPassword,10);

        user.password =hashedNewPassword;
        await user.save();

        tokenData.resetToken =undefined;
        tokenData.resetTokenExpires = undefined;
        await tokenData.save();
        return {
        message: "Mot de passe réinitialisé avec succès",
    };

    };
}

export default new AuthService();
