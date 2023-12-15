import mongooes, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
        },        
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avtar: {
            type: String // useing cloudenary url as string
        }  

    }
)

export const User = mongooes.model("User", userSchema);