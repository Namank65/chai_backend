import { ApiError } from "../utils/apiError.js";
import { asyncHeandler } from "../utils/asyncHeandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.Model.js";

export const VerifyJWT = asyncHeandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        };

        const decorededToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decorededToken?._id).select("-password -refreshTokens");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        };

        req.user = user
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
});