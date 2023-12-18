import {asyncHeandler} from "../utils/asyncHeandler.js";
import {ApiError} from "../utils/apiError.js";
import  {User}  from "../models/User.Model.js";

const registerUser = asyncHeandler( async ( req, res ) => {
    // git user details from frontend
    //validation not empty
    //check if user already exist (username or email)
    // check for images specially for avtar
    //Upload them on cloudinary avtar
    //create user object - create entry in data base
    //remove password and refresh token field  from responce
    //check for user creation 
    //return responce

    const {userName, email, fullname, password} = req.body;
    console.log(`Email: ${email}`, `UserName: ${userName}`, `Fullname: ${fullname}`, `Password: ${password}`);

    if (
        [userName, email, fullname, password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(400, "All Field Are Required")
    };

    if (!email.includes("@")) throw new ApiError;


    const exestingUser = User.findOne({
        $or: [{userName}, {email}]
    })

    if(exestingUser) {
        throw new ApiError(409, "User With Email Or User Name Already Exiest")
    }
} )

export {registerUser};