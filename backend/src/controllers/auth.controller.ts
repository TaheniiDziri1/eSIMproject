import { Request, Response,NextFunction } from "express";
import authService from "../services/auth.service";

export const signup = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const {user,activationToken} = await authService.signup(username, email, password);
        const safeUser ={
            id:user._id,
            username:user.username,
            email:user.email,
        }
        res.status(201).json({ message: "utilisateur créé", safeUser });
    } catch (err) {
        next(err);
    }
};

export const signin = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const data = await authService.signin(email, password);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const requestPasswordReset = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const { email } = req.body;
        const { resetToken } = await authService.requestPasswordReset(email);
        res.json({
            message: "Email envoyé pour réinitialisation du mot de passe",
            resetToken,
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
