import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const [email , setEmail] = useState("");
    const [name , setName] = useState("");
    const [password , setPassword] = useState("");
    const [role , setRole] = useState("client");
    const [error , setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(){
        const res= await fetch("http://localhost:3000/auth/signup",{
            method:"POST",
            headers:{
                "content-Type":"application/json",
            },
            body:JSON.stringify({name, password, email, role})
        })
        const data= await res.json()

        if(data.success){
            localStorage.setItem("token",data.data.token)

            if(data.data.role==="agent"){
                navigate("/Dashboard")
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
                <option value="canditate" >Client</option>
                <option value="admin">Freelancer</option>
                <option value="agent">Freelancer</option>
                <option value="supervisor">Freelancer</option>
            </select>

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
