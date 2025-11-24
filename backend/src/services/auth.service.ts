import  User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
    async signup(username:string, email:string,password:string){
        const existingUser = await User.findOne({email});
        if(existingUser) throw new Error("Email deja utilise");
        const hashedPassword =await bcrypt.hash(password,10);

        const user = await User.create({
            username,
            email,
            password:hashedPassword,
        })

        return user ;
    }

    async signin(email:string, password:string){
        const user = await User.findOne({email});
        if(!user) throw new Error("utilisateur introuvable");

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) throw new Error("Mot de passe incorrect");

        const token = jwt.sign(
            {id:user._id, email:user.email},
            process.env.JWT_SECRET || "secret",
            {expiresIn:"7d"}
            );
            return {user,token};
    }
}

export default new AuthService();
