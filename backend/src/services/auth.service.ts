import User from "../models/User";
import Token from "../models/Token";
import bcrypt from "bcryptjs";
import dayjs from 'dayjs';
import jwt from "jsonwebtoken";

class AuthService {
    async signup(username: string, email: string, password: string) {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("Email deja utilise");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return user;
    }

    async signin(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Utilisateur introuvable");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Mot de passe incorrect");

        // Nouveau token + refreshToken
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "15m" } 
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET || "refreshsecret",
            { expiresIn: "30d" } 
        );

        //calculer les date 
        const tokenIssuedAt = new Date();
        const tokenExpiresAt=dayjs(tokenIssuedAt).add(15,"minute").toDate();

        const refreshIssuedAt = new Date();
        const refreshExpiresAt =dayjs(refreshIssuedAt).add(30,"day").toDate();

        
        await Token.findOneAndUpdate(
            { userId: user._id },
            { token, refreshToken,tokenIssuedAt,tokenExpiresAt, refreshIssuedAt,refreshExpiresAt},
            { upsert: true, new: true }
        );

        const { password: _, ...userData } = user.toObject();

        return { user: userData, token, refreshToken };
    }

    async refreshToken(oldRefresh: string) {

        const savedToken = await Token.findOne({ refreshToken: oldRefresh });
        if (!savedToken) throw new Error("Refresh token invalide");

        const decoded: any = jwt.verify(
            oldRefresh,
            process.env.JWT_REFRESH_SECRET || "refreshsecret"
        );

        const newToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "15m" }
        );

        const newRefresh = jwt.sign(
            { id: decoded.id },
            process.env.JWT_REFRESH_SECRET || "refreshsecret",
            { expiresIn: "30d" }
        );

        // Mettre à jour table Token
        savedToken.token = newToken;
        savedToken.refreshToken = newRefresh;
        savedToken.tokenIssuedAt = new Date();
        savedToken.tokenExpiresAt = dayjs().add(15, "minute").toDate();

        savedToken.refreshIssuedAt = new Date();
        savedToken.refreshExpiresAt = dayjs().add(30, "day").toDate();
        await savedToken.save();

        return { token: newToken, refreshToken: newRefresh };
    }
}

export default new AuthService();
