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

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullname: this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPERY
        }
    )
};

export const User = mongooes.model("User", userSchema);