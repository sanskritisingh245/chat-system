import z, { email } from "zod";


export const SignupSchema = z.object({
    name:z.string(),
    email:z.email(),
    password:z.string(),
    role:z.enum(["candidate", "agent", "supervisor", "admin"]),
    supervisorId:z.string().optional()
})

export const LoginSchema = z.object({
    email:z.email(),
    password:z.string(),
})

export const ConversationSchema = z.object({
    content: z.string().min(1),
});

export const AssignConversationSchema = z.object({
    agentId: z.string(),
});
