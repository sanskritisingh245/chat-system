import { useEffect, useState } from "react";

export default function DashboardPage(){
    const[conversations , setConversations] = useState([]);
    const [agents, setAgents] = useState([]);

    async function fetchData() {
        const res = await fetch("http://localhost:3000/conversations", { 
            headers: { 
                authorization: localStorage.getItem("token") ?? ""

            } 
        });
        const data = await res.json();
        if (data.success) {
            setConversations(data.data.conversations);
        }

        const agentRes = await fetch("http://localhost:3000/agents", {
            headers: { 
                authorization: localStorage.getItem("token") ?? ""
            }
        });

        const agentData = await agentRes.json();
        if (agentData.success) {
            setAgents(agentData.data.agents);
        }
    }
    
    useEffect(()=> {
        fetchData();
    }, [])

    async function handleAssign(conversationId: string, agentId: string) {
        await fetch(`http://localhost:3000/conversations/${conversationId}/assign`, {
            method: "POST",
            headers: { 
                "content-type": "application/json", 
                authorization:  localStorage.getItem("token") ?? ""
            },
            body: JSON.stringify({ 
                agentId 
            }),
        });
    }

    return (
        <div>
            {conversations.map((c: any) => (
                <div key={c._id}>
                    <span>{c.status}</span>
                    <span>{c.agentId ?? "Unassigned"}</span>
                    <select onChange={(e) => handleAssign(c._id, e.target.value)} defaultValue="">
                        <option value="" disabled>Assign agent</option>
                        {agents.map((a: any) => (
                            <option key={a._id} value={a._id}>{a.name}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}

