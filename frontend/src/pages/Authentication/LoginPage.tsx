import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login({onLogin}){
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error , setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(){
        const res= await fetch("http://localhost:3000/auth/login",{
            method:"POST",
            headers:{
                "content-Type":"application/json",
            },
            body:JSON.stringify({password, email,})
        })
        const data= await res.json()

        if(data.success){
            localStorage.setItem("token", data.data.token)
            onLogin();
            if(data.data.role==="agent"){
                navigate("/agent/dashboard")
            }else if(data.data.role==="candidate"){
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
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            >
            </input>

            <button onClick={handleSubmit}>Login</button>

            <p>
                Don't have an account?
                <span onClick={() => navigate("/signup")}>
                    SIGN UP
                </span>
            </p>
        </div>
    )
}