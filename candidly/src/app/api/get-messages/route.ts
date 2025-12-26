import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

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

    /*
    while working with aggregation pipeline of mongoDB
    we cant pass the user id in string as we are getting from session
    it can cause issues, so first we need to convert it to mongoose type object id
    */

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await userModel.aggregate([
            // these are the aggregation pipelines of mongoDB
            { $match: { id: userId } }, // for matching the data shown with userId
            { $unwind: '$messages' }, // unwind destructures the array elements to separate objects
            { $sort: { 'messages.createdAt': -1 } }, // sorting in descending order of createdAt
            { $group: { _id: '$_id', messages: { $push: '$messages' } } } // grouping messsages based on userid and then pushing messages
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 401 },

            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages // from aggregation pipeliine we get an array of various objects
            },
            { status: 200 },

        )

    } catch (error) {
        console.error("An unexpected error occured", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 },

        )
    }
}