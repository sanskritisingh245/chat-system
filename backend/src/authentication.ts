import express, { type Response, type Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginSchema, SignupSchema } from "../zod";
import { authMiddleware } from "../authMiddlware";

const{userModel}=require("../model");


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/auth/signup", async (req:Request, res:Response) => {
    try{
        const {success, data} = SignupSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }

        const exsistingUser= await userModel.findOne({email:data.email})

        if(exsistingUser){
            return res.status(411).json({
                success:false,
                error:"Email already exsists"
            })
        }


        const hash = await bcrypt.hash(data.password, 10);
        const user =await userModel.create({
            name:data.name,
            email:data.email,
            password:hash,
            role:data.role
        })
        const role = user.role

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name:user.name,
                role:user.role
            },
            JWT_SECRET!,
        );


        return res.status(200).json({
            success:true,
            msg:"USER_SUCCESSFULLY_CREATED",
            data:{
                token,
                role:role
            }
        })


    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

router.post("/auth/login", async (req:Request, res:Response) => {
    try{
        const {success, data } = LoginSchema.safeParse(req.body);
        if(!success) {
            return res.status(400).json({
                success:false,
                error:"INVALID_REQUEST"
            })
        }

        const existingUser = await userModel.findOne({email:data.email})

        if(!existingUser) {
            return res.status(400).json({
                success:false,
                error:"USER_NOT_FOUND_PLEASE_SIGNUP"
            })
        }

        const password = await bcrypt.compare(data.password, existingUser.password);
        if(!password){
            return res.status(400).json({
                success:false,
                error:"INVALID_CREDENTIALS"
            })
        }
        const role = existingUser.role

        const token = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                name:existingUser.name,
                role:existingUser.role
            },
            JWT_SECRET!,
        );

        return res.status(200).json({
            success:true,
            msg:"SUCCESSFULLY_SIGNEDIN",
            data:{
                token,
                role:role
            }
        })


    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

router.get("/auth/me",authMiddleware,async (req:Request, res:Response) => {
    try{
        const userId = req.id;
        const user = await userModel.findById({userId})

        return res.status(200).json({
            success:true,
            data:{
                user
            }
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

export default router;