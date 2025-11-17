import mongoose, {Schema, Document} from "mongoose";

// interface is User defined
export interface Message extends Document{
    content: string;
    createdAt: Date;
}

// schema properties are predefined
const messageSchema: Schema<Message> = new Schema({

    content: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
    
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean,
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({

    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true, 
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // we can write regular expression in match. can generate it or refer regexr
        match: [/.+\@.+\..+/, "please enter a valid email address"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    messages: [messageSchema]

})

/* 
creating the model
in first condition it assumes that the schema is already created in DB
else in second condition after or it creates the schema in DB
we have also included TS after "as" for type safety but it is optional
*/
const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model("User", userSchema)) 

export default userModel;