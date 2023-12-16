import mongooes, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
            type: String, // useing cloudenary url as string
            required: true
        },
        CoverImage: {
            type: String, // useing cloudenary url as string
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Videos"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        refreshTokens: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// middleWare
userSchema.pre("save", async function(next){

// This will Encrypt the password    
     
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongooes.model("User", userSchema);