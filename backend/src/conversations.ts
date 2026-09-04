import express, { type Response, type Request } from "express";
import { authMiddleware } from "../authMiddlware";
import { AssignConversationSchema, ConversationSchema } from "../zod";

const router = express.Router();
const{conversationModel, messagesModel , userModel}=require("../model");

router.post("/conversations", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { success, data } = ConversationSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ 
                success: false, 
                error: "INVALID_REQUEST" 
            });
        }

        const conversation = await conversationModel.create({ candidateId: req.id });
        await messagesModel.create({
            conversationId: conversation._id,
            senderId: req.id,
            senderRole: "candidate",
            content: data.content,
        });

        return res.status(200).json({ 
            success: true, 
            data: { 
                conversation 
            } 
        });
    } catch (e: any) {
        return res.status(500).json({ 
            success: false, 
            msg: e.message || "Internal Server Error" 
        });
    }
});

router.get("/conversations/:id" ,authMiddleware, async (req:Request, res:Response)=> {
    try{
        const conversationId = req.params.id as string;
        const conversation = await conversationModel.findById(conversationId)
        if(conversation.candidateId.toString() !== req.id){
            return res.status(400).json({
                success:false,
                error:"UNAUTHORIZED"
            })
        }

        return res.status(200).json({
            success:true,
            data:{
                conversation
            }
        })

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
})

router.post("/conversations/:id/assign", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { success, data } = AssignConversationSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ 
                success: false, 
                error: "INVALID_REQUEST" 
            });
        }
        const user = await userModel.findById(req.id);

        if (user.role != "supervisor"){
            return res.status(400).json({
                success:false,
                error:"UNAUTHORIZED"
            })
        }

        const conversation = await conversationModel.findByIdAndUpdate(
            req.params.id,
            { agentId: data.agentId, status: "assigned" },
            { new: true }
        );

        return res.status(200).json({ 
            success: true, 
            data: { 
                conversation 
            } 
        });
        
    } catch (e: any) {
        return res.status(500).json({ 
            success: false, 
            msg: e.message || "Internal Server Error" 
        });
    }
});

router.post("/conversations/:id/close", authMiddleware, async (req:Request, res:Response)=> {
    try{   
        const user = await userModel.findById(req.id);

        if (user.role != "agent"){
            return res.status(400).json({
                success:false,
                error:"UNAUTHORIZED"
            })
        }

        const conversation = await conversationModel.findByIdAndUpdate(
            req.params.id,
            { status: "closed", closedAt: new Date() },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: { conversation },
        });

    }catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
});