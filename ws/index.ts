import { WebSocketServer, WebSocket } from "ws";
import jwt, { type JwtPayload } from "jsonwebtoken";
const { conversationModel , messagesModel } = require("../backend/model");


const JWT_SECRET = process.env.JWT_SECRET;

const wss = new WebSocketServer({port: 8080});

const rooms = new Map<string, Set<WebSocket>>();
const messageBuffers = new Map<string, any[]>();



wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) {
        ws.close();
        return;
      }

    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    if(!decoded){
        ws.close();
        return;
    }

    const userId = decoded.id;
    const role = decoded.role;
    const joinedConversations = new Set<string>();


   

    ws.on("message", async(raw ) => {
        try{

            const {event , data} = JSON.parse(raw.toString());
            if (event === "JOIN_CONVERSATION") {
                const conversation = await conversationModel.findById(data.conversationId)
                if(!conversation){
                    ws.send(JSON.stringify({
                        event:"ERROR",
                        data:{ message: "CONVERSATION_NOT_FOUND" }
                    }))
                    return
                }
                const isMember = userId === conversation.candidateId?.toString() || userId === conversation.agentId?.toString();
                if(!isMember){
                    ws.send(JSON.stringify({
                        event:"ERROR",
                        data:{ message: "UNAUTHORIZED" }
                    }))
                    return
                }
    
                if(!rooms.has(data.conversationId)){
                    rooms.set(data.conversationId, new Set())
                }
                rooms.get(data.conversationId)!.add(ws)
                joinedConversations.add(data.conversationId);

                const history = messageBuffers.get(data.conversationId) ?? [];
                for (const message of history) {
                    ws.send(JSON.stringify({ event: "NEW_MESSAGE", data: message }));
                }

            }
            else if (event === "SEND_MESSAGE"){
                if(!joinedConversations.has(data.conversationId)){
                    ws.send(JSON.stringify({
                        event:"ERROR",
                        data:{
                            message:"JOIN_THE_CONVERSATION"
                        }
                    }))
                    return;
                }
                
                const message= {
                    conversationId: data.conversationId,
                    senderId:userId,
                    senderRole: role,
                    content: data.content,
                    createdAt: new Date(),
                }
    
                if (!messageBuffers.has(data.conversationId)) {
                    messageBuffers.set(data.conversationId, []);
                }
                messageBuffers.get(data.conversationId)!.push(message);
    
                for (const client of rooms.get(data.conversationId)!) {
                    client.send(JSON.stringify({ 
                        event: "NEW_MESSAGE", 
                        data: message 
                    }));
                }
    
            }else if( event === "LEAVE_CONVERSATION"){
                rooms.get(data.conversationId)?.delete(ws);
                joinedConversations.delete(data.conversationId);
    
            }else if(event === "CLOSE_CONVERSATION"){
                if(role !== "agent"){
                    ws.send(JSON.stringify({
                        event:"ERROR",
                        data:{ message: "UNAUTHORIZED" }
                    }))
                    return
                }
               const buffered = messageBuffers.get(data.conversationId) ?? [];
                if (buffered.length > 0) {
                    await messagesModel.insertMany(buffered);
                }
    
                await conversationModel.findByIdAndUpdate(data.conversationId, {
                    status: "closed",
                    closedAt: new Date(),
                });
    
                for (const client of rooms.get(data.conversationId) ?? []) {
                    client.send(JSON.stringify({
                        event: "CONVERSATION_CLOSED",
                        data: { conversationId: data.conversationId },
                    }));
                }
    
                rooms.delete(data.conversationId);
                messageBuffers.delete(data.conversationId);
            }
        }catch (e: any) {
        ws.send(JSON.stringify({
            event: "ERROR",
            data: { message: e.message || "Something went wrong" }
        }));
    }

    })
    
    ws.on("close", () => {
    for (const conversationId of joinedConversations) {
        rooms.get(conversationId)?.delete(ws);
    }
});

})
