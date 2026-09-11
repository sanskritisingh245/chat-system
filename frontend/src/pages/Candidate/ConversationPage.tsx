import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"

export default function ConversationPage(){
    const { id } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const ws = useRef<WebSocket | null>(null);

    async function fetchData() {
        const res = await fetch(`https://api.chat-system.sanskriti.xyz/conversations/${id}`, {
            method:"GET",
            headers: { 
                authorization: localStorage.getItem("token") ?? "" 
            },
        });
        const data = await res.json();
        if (data.success) {
            setStatus(data.data.conversation.status);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const socket = new WebSocket(`wss://api.chat-system.sanskriti.xyz/ws?token=${token}`);
        ws.current = socket;

        socket.onopen= () => {
            socket.send(JSON.stringify({
                event: "JOIN_CONVERSATION",
                data:{
                    conversationId: id
                }
            }))
        };

        socket.onmessage = (e) => {
            const { event, data } = JSON.parse(e.data);
            if (event === "NEW_MESSAGE") {
                setMessages((prev) => [...prev, data]);
            } else if (event === "CONVERSATION_CLOSED") {
                setStatus("closed");
            } else if (event === "ERROR") {
                alert(data.message);
            }
        };
        return () => {
            socket.send(JSON.stringify({ 
                event: "LEAVE_CONVERSATION", 
                data: { 
                    conversationId: id 
                } 
            }));
            socket.close();
        };
    }, [id]);

    function handleSend() {
        ws.current?.send(JSON.stringify({ 
            event: "SEND_MESSAGE", 
            data: { 
                conversationId: id, content 
            } 
        }));
        setContent("");
    }


    return (
        <div>
            <div>Status: {status}</div>
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
        </div>
    );
}
