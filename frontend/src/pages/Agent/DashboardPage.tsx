import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    async function fetchData(){
        const res = await fetch("http://localhost:3000/agent/conversations", {
            method:"GET",
            headers:{
                authorization :localStorage.getItem("token") ?? "" 
            }
        });

        const data = await res.json();
        if(data.success){
            setConversations(data.data.conversations);
        }
    }

    useEffect(() => {
        fetchData();
    },[])
    
    return (
        <div>
            {conversations.map((c: any) => (
                <div key={c._id} 
                    onClick={() => navigate(`/agent/conversation/${c._id}`)}>
                    <span>{c.status}</span>
                </div>
            ))}
        </div>
    );
}
