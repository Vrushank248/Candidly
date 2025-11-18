import {z} from "zod";

export const signInSchema = z.object({
    // identifier is generic name in production for uique things like email or username
    identifier: z.string(),
    password: z.string()
    
})