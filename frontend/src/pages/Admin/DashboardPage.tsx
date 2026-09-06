import { useEffect, useState } from "react"

export default function AdminDashboad(){
    const [supervisors , setSupervisors] = useState([]);

    async function fetchData(){
        const res= await fetch ("http://localhost:3000/admin/analytics/supervisors", {
            method:"GET",
            headers:{
                authorization: localStorage.getItem("token") ?? ""
            }
        });
        const data = await res.json();
        if(data.success){
            setSupervisors(data.data.supervisors);
        }
    }

    useEffect(() => {
        fetchData();
    },[])
        return (
        <div>
            {supervisors.map((supervisor: any) => (
                <div key={supervisor.email}>
                    <span>{supervisor.name}</span>
                    {" — Agents: "}
                    <span>{supervisor.agentCount}</span>
                    {" — Conversations: "}
                    <span>{supervisor.conversationsHandled}</span>
                </div>
            ))}
        </div>
    );
}

