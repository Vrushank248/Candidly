import {z} from "zod";

export const signInSchema = z.object({
    // identifier is generic name used in production for unique things like email or username
    identifier: z.string(),
    password: z.string()
    
})