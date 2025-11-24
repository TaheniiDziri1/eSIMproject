import {Request,Response} from "express";
import authService from "../services/auth.service";

export const signup = async (req:Request , res:Response)=>{
    try{
        const {username, email, password} =req.body;
        const user = await authService.signup(username,email,password);
        res.status(201).json({message:"utilisateur créé",user});
    } catch(err:any){
        res.status(400).json({error:err.message})
    }

};

export const signin =async(req:Request,res:Response) =>{
    try{
        const{email,password}=req.body;
        const data = await authService.signin(email,password);
        res.json(data);
    }catch(err:any){
        res.status(400).json({error:err.message});
    }
};

export const getProfile = (req: Request, res: Response) => {
    res.json({
        message: "Profil de l'utilisateur connecté",
        user: (req as any).user,
    });
};