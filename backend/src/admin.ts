import express, { type Response, type Request } from "express";
import { authMiddleware } from "../authMiddlware";

const router = express.Router();
const { userModel, conversationModel } = require("../model");

router.get("/admin/analytics/supervisors", authMiddleware, async (req: Request, res: Response) => {
    try {
        const admin = await userModel.findById(req.id);
        if (admin.role != "admin") {
            return res.status(400).json({
                success: false,
                error: "UNAUTHORIZED",
            });
        }

        const supervisorList = await userModel.find({ role: "supervisor" });
        const agents = await userModel.find({ role: "agent" });
        const conversations = await conversationModel.find({ agentId: { $ne: null } });

        const supervisors = supervisorList.map((supervisor: any) => {
            const myAgentIds = agents
                .filter((agent) => agent.supervisorId?.toString() === supervisor.id)
                .map((agent) => agent.id);

            return {
                name: supervisor.name,
                email: supervisor.email,
                agentCount: myAgentIds.length,
                conversationsHandled: conversations.filter((conversation) =>
                    myAgentIds.includes(conversation.agentId.toString())
                ).length,
            };
        });

        return res.status(200).json({
            success: true,
            data: { supervisors },
        });
    } catch (e: any) {
        return res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error",
        });
    }
});

module.exports = router;
