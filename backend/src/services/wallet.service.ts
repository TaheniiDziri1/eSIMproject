import User from "../models/User";

class WalletService {

    async addBalance(userId:string,amount:number){
        const user =await User.findById(userId);
        if(!user) throw new Error("utilisateur introuvable");
        user.balance += amount;
        await user.save();
        return user.balance;
    }

    async checkBalance(userId:string){
        const user = await User.findById(userId);
        if(!user) throw new Error ("utilisateur introuvable");
        return user.balance;
    }
    async deductBalance(userId:string,amount:number){
        const user = await User.findById(userId);
        if (!user) throw new Error("Utilisateur introuvable");
        if (user.balance < amount) throw new Error("Solde insuffisant");
        user.balance -= amount;
        await user.save();
        return user.balance;
    }
}
export default new WalletService();
