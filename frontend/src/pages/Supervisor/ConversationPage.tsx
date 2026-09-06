import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function ConversationPage(){
    const {id} = useParams();
    const[conversations, setConversations] = useState<any>(null);
    const [agents, setAgents] = useState([]);
    
    async function fetchData() {
        const res = await fetch(`http://localhost:3000/conversations/${id}`, { 
            headers: {
                authorization:localStorage.getItem("token") ?? ""
            } 
        });
        const data = await res.json();
            if (data.success) {
                setConversations(data.data.conversation);
            }

        const agentRes = await fetch("http://localhost:3000/agents", { 
            headers: { 
                authorization:localStorage.getItem("token") ?? ""
            } 
        });

        const agentData = await agentRes.json();
        if (agentData.success) {
            setAgents(agentData.data.agents);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id])

    async function handleAssign(agentId: string) {
        await fetch(`http://localhost:3000/conversations/${id}/assign`, {
            method: "POST",
            headers: { 
                "content-type": "application/json", 
                authorization: localStorage.getItem("token") ?? "" 
            },
            body: JSON.stringify({ agentId }),
        });
        fetchData();
    }


    if (!conversations) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>Status: {conversations.status}</div>
            <div>Candidate: {conversations.candidateId}</div>
            <div>Agent: {conversations.agentId ?? "Unassigned"}</div>
            <select onChange={(e) => handleAssign(e.target.value)} defaultValue="">
                <option value="" disabled>Reassign agent</option>
                {agents.map((a: any) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                ))}
            </select>
        </div>
    );
}

      