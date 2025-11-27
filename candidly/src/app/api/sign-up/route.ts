import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";


// strictly write fn name in CAPS. it is convention in Nextjs

export async function POST(request: Request) {

    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified: true // this will be treated as AND condition
        })
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if (existingUserVerifiedByUsername) {
            // user already exist and verified
            Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await userModel.findOne({ email })

        if(existingUserByEmail){
            // user email already exist and verified
            if(existingUserByEmail.isVerified){
                    return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {status: 400})
            }else{
                // user email exists but unverified
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // convert 1 ms to 1 hour
                await existingUserByEmail.save()
            }
        }else{
            // user doesn't exist
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date() // here new keyword is used. hence we can write let/ const and still modify its value

            expiryDate.setHours(expiryDate.getHours() + 1)

            
            const newUser = new userModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            })

            await newUser.save()
        }
            // this method is for verification email whether a user is new or existing
            const emailResponse = sendVerificationEmail(email, username, verifyCode)

            if(!(await emailResponse).success){
                return Response.json({
                    success: false,
                    message: (await emailResponse).message
                }, {status: 500})
            }
            return Response.json({
                    success: true,
                    message: "User registered successfully. Please verify your email"
                }, {status: 201})
        

    } catch (error) {
        console.log("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500,
            }
        )

    }
}