import z, { email } from "zod";


export const SignupSchema = z.object({
    name:z.string(),
    email:z.email(),
    password:z.string(),
    role:z.enum(["candidate", "agent", "supervisor", "admin"])
})

export const LoginSchema = z.object({
    email:z.email(),
    password:z.string(),
})