import {z} from "zod";
// when there is single value we can directly used z methods
export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters long")
    .max(20, "Username must be atmost 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")
    
// when there are multiple valdiations we can use z object
export const signUpSchema = z.object({

    username: usernameValidation,
    email: z.email({message: "invalid email addeess"}),
    password: z.string().min(6,{message: "password must be atleast 6 characters long"})
})