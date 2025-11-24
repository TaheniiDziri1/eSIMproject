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

        //Generer token de 7j
        const token = jwt.sign(
            {id:user._id,email:user.email},
            process.env.JWT_SECRET || "secret",
            {expiresIn:"7d"}
        );

        user.token = token;
        await user.save();
        const { password: _, token: __, ...userData} =user.toObject();
        return {user:userData,token};
    }

    async refreshToken(oldToken:string){
        const user = await User.findOne({token:oldToken});
        if(!user) throw new Error("Token invalide");

        //Generer un nouveau token

        const newToken = jwt.sign(
            {id: user._id ,email:user.email},
            process.env.JWT_SECRET || "secret",
            {expiresIn:"7d"}
        );

        user.token =newToken;
        await user.save();
        return{token:newToken};

    }
}

export default new AuthService();
