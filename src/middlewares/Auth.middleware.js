import { asyncHeandler } from "../utils/asyncHeandler";

export const VerifyJWT = asyncHeandler( async (req, res, next) => {
    req.cookies.accessToken
})