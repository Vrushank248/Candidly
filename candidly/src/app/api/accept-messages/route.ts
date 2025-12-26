import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

// server session is used for getting info from session.
// so that we can find logged in users
// but geServerSession requires authoptions compulsorily

export async function POST(request: Request) {

    await dbConnect()

    const session = await getServerSession(authOptions)
    // defining type of user is optional here
    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 },

        )
    }
    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true } // this will return the updated value
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                { status: 401 },

            )
        }


        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 },

        )


    } catch (error) {
        console.error("failed to update user status to accept messages", error);
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            },
            { status: 500 },

        )
    }
}

export async function GET(request: Request) {
    dbConnect()

    const session = await getServerSession(authOptions)
    // defining type of user is optional here
    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 },

        )
    }
    const userId = user._id

    try {
        
            const foundUser = await userModel.findById(userId)

            if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 },

            )
        }

                    return Response.json(
                {
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessage,
                    message: "Successfully fetched acceptance status of user"
                },
                { status: 200 },

            )

    } catch (error) {
        console.error("Error in fetching message acceptance status", error);
        return Response.json(
            {
                success: false,
                message: "Error in fetching message acceptance status"
            },
            { status: 500 },

        )
    }
}