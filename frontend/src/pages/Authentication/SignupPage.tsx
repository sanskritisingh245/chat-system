import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const [email , setEmail] = useState("");
    const [name , setName] = useState("");
    const [password , setPassword] = useState("");
    const [role , setRole] = useState("candidate");
    const [supervisorId , setSupervisorId] = useState("");
    const [supervisors , setSupervisors] = useState([]);
    const [error , setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSupervisors(){
            const res = await fetch("https://api.chat-system.sanskriti.xyz/supervisors");
            const data = await res.json();
            if(data.success){
                setSupervisors(data.data.supervisors);
            }
        }
        fetchSupervisors();
    }, []);

    async function handleSubmit(){
        const res= await fetch("https://api.chat-system.sanskriti.xyz/auth/signup",{
            method:"POST",
            headers:{
                "content-Type":"application/json",
            },
            body:JSON.stringify({name, password, email, role, supervisorId})
        })
        const data= await res.json()

        if(data.success){
            localStorage.setItem("token",data.data.token)

            if(data.data.role==="agent"){
                navigate("/agent/dashboard")
            }else if(data.data.role=== "candidate"){
                navigate("/candidate/dashboard")
            }else if (data.data.role === "admin"){
                navigate("/admin/dashboard")
            }else{
                navigate("/supervisor/dashboard")
            }
        } else {
            setError(data.error ?? "Something went wrong")
        }
    }
    return(
        <div>
            <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            >
            </input>
            <input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            >
            </input>
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            >
            </input>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="candidate" >candidate</option>
                <option value="admin">admin</option>
                <option value="agent">agent</option>
                <option value="supervisor">supervisor</option>
            </select>

            {role === "agent" && (
                <select value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}>
                    <option value="" disabled>Select supervisor</option>
                    {supervisors.map((s: any) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>
            )}

            <button onClick={handleSubmit}>Signup</button>
        
            <p>
                Already have an account?
                <span onClick={() => navigate("/login")}>
                    Log in
                </span>
          </p>
        </div>
    )
}
