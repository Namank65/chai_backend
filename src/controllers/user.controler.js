import { asyncHeandler } from "../utils/asyncHeandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.Model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponce } from "../utils/apiResponce.js";
import jwt from "jsonwebtoken"

const GenerateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshTokens = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(401, "Something Went Wrong While Generating Access and Refresh Tokens")
    }
};

const registerUser = asyncHeandler(async (req, res) => {
    // git user details from frontend
    //validation not empty
    //check if user already exist (username or email)
    // check for images specially for avtar
    //Upload them on cloudinary avtar
    //create user object - create entry in data base
    //remove password and refresh token field  from responce
    //check for user creation 
    //return responce

    const { userName, email, fullname, password } = req.body;
    // console.log(`Email: ${email}`, `UserName: ${userName}`, `Fullname: ${fullname}`, `Password: ${password}`);

    if (
        [userName, email, fullname, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All Field Are Required")
    };

    if (!email.includes("@")) throw new ApiError;


    const exestingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (exestingUser) {
        throw new ApiError(409, "User With Email Or User Name Already Exiest")
    };

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverimageLocalPath = req.files?.coverimage[0]?.path;

    let coverimageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimageLocalPath = req.files.coverimage[0].path
    };

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
        avatar: avatar.url,
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

});

const LoginUser = asyncHeandler(async (req, res) => {
    // req data from body;
    // validate of username and email 
    // find the user 
    // check the password
    // send access and refresh token to the user
    // send cookie
    // lastly send the respos of success 

    const { email, userName, password } = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "Username Or Email Is Must Required")
    };

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User Does Not Exist")
    };

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    };

    const { accessToken, refreshToken } = await GenerateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponce(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User LoggedIn successfully"
            )
        )

});

const LogoutUser = asyncHeandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };


    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponce(200, {}, "User Logged Out Successfully")
        );

});

const refreshAccessToken = asyncHeandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised Request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiError(402, "Invalid refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshTokens) {
            throw new ApiError(401, "Refresh Token Is Expired Or Used Already")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, NewRefreshToken } = await GenerateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", NewRefreshToken, options)
            .json(
                new ApiResponce(
                    200,
                    { accessToken, refreshToken: NewRefreshToken },
                    "Access Token Refreshed Successfully"
                )
            )
    } catch (error) {
        new ApiError(401, error?.message || "Invalid Refresh Token")
    }

});

const changeCurrentPassword = asyncHeandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await User.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponce(200, {}, "Password Changed Successfully")
        )
});

const getCurrentUser = asyncHeandler(async(req, res) => {
    return res
    .status(200)
    .json(200, req.user, "Current User Fetched Successfully")
    
});

export {
    registerUser,
    LoginUser,
    LogoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser

};