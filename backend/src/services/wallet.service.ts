import User from "../models/User";
import AppError from "../utils/AppError";

class WalletService {

    async addBalance(userId:string,amount:number){
        const user =await User.findById(userId);
        if(!user) throw new AppError("utilisateur introuvable",400);
        user.balance += amount;
        await user.save();
        return user.balance;
    }

    async checkBalance(userId:string){
        const user = await User.findById(userId);
        if(!user) throw new AppError ("utilisateur introuvable",404);
        return user.balance;
    }
    async deductBalance(userId:string,amount:number){
        const user = await User.findById(userId);
        if (!user) throw new Error("Utilisateur introuvable");
        if (user.balance < amount) throw new AppError("Solde insuffisant",400);
        user.balance -= amount;
        await user.save();
        return user.balance;
    }
}
export default new WalletService();
