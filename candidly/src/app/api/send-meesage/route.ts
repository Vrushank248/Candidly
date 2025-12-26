import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {

    await dbConnect()

    const { username, content } = await request.json()

    try {
        const receiverUser = await userModel.findOne(username)

        if (!receiverUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 },

            )
        }

        // checking is Receiver user accepting the messages
        if (!receiverUser.isAcceptingMessage) {

            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                },
                { status: 403 },

            )

        }

        const newMessage = { content, createdAt: new Date() }

        receiverUser.messages.push(newMessage as Message) // we are confirming using assertion that the type of message is as per the Message interface
        await receiverUser.save()

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status: 200 },

        )

    } catch (error) {
        console.error("Error sending message", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 },

        )
    }
}