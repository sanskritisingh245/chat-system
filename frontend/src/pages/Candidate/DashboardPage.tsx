import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const [conversations, setConversations] = useState([]);
    const [content , setContent] = useState("");
    const navigate = useNavigate();

    async function fetchData() {
        const res = await fetch("http://localhost:3000/candidate/conversations", {
            method:"GET",
            headers: { 
                authorization: localStorage.getItem("token") ?? "" 
            },
        });

        const data = await res.json();
        if (data.success) {
            setConversations(data.data.conversations);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);


    async function handleCreate() {
        await fetch("http://localhost:3000/conversations", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: localStorage.getItem("token") ?? "",
            },
            body: JSON.stringify({ content }),
        });
        setContent("");
        fetchData();
    }


    return (
        <div>
            <input 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Describe your issue" 
            />

            <button onClick={handleCreate}>Create Conversation</button>

            {conversations.map((c: any) => (
                <div key={c._id} 
                    onClick={() => navigate(`/candidate/conversation/${c._id}`)}>
                    <span>{c.status}</span>
                </div>
            ))}
        </div>
    );
}


