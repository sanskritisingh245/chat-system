import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ConversationPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const socket = new WebSocket(`wss://api.chat-system.sanskriti.xyz/ws?token=${token}`);
        ws.current = socket;

        socket.onopen = () => {
            socket.send(JSON.stringify({ 
                event: "JOIN_CONVERSATION", 
                data: { conversationId: id } 
            }));
        };

        socket.onmessage = (e) => {
            const { event, data } = JSON.parse(e.data);
            if (event === "NEW_MESSAGE") {
                setMessages((prev) => [...prev, data]);
            } else if (event === "CONVERSATION_CLOSED") {
                alert("Conversation closed");
            } else if (event === "ERROR") {
                alert(data.message);
            }
        };
        return () => {
                socket.send(JSON.stringify({ event: "LEAVE_CONVERSATION", data: { conversationId: id } }));
                socket.close();
            };
    }, [id]);

    function handleSend() {
        ws.current?.send(JSON.stringify({ 
            event: "SEND_MESSAGE", 
            data: { conversationId: id, content } 
        }));

        setContent("");
    }

    function handleClose() {
        ws.current?.send(JSON.stringify({ 
            event: "CLOSE_CONVERSATION", 
            data: { conversationId: id } 
        }));
    }



    return (
        <div>
            <div>
                {messages.map((m, i) => (
                    <div key={i}>{m.senderRole}: {m.content}</div>
                ))}
            </div>
            <input 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={handleClose}>Close Conversation</button>
        </div>
    );
}



