import {asyncHeandler} from "../utils/asyncHeandler.js";
import {ApiError} from "../utils/apiError.js";
import  {User}  from "../models/User.Model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import {ApiResponce} from "../utils/apiResponce.js";

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
        [userName, email, fullname, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Field Are Required")
    };

    if (!email.includes("@")) throw new ApiError;


    const exestingUser = User.findOne({
        $or: [{userName}, {email}]
    })

    if(exestingUser) {
        throw new ApiError(409, "User With Email Or User Name Already Exiest")
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File Is Required")
    };

    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverimage = await uploadCloudinary(coverimageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar File Is Required")
    };

    const user = await User.create({
        fullname,
        avtar: avatar.url,
        coverimage: coverimage?.url || "",
        password,
        email,
        userName: userName.toLowerCase()
    });

    const CreatedUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    );

    if (!CreatedUser) {
        throw new ApiError(500, "OOPS, Something went Wrong while registering a user!")
    };

    return res.status(201).json(
        new ApiResponce(200, CreatedUser, "User Registered Successfully")
    )

} )

export {registerUser};