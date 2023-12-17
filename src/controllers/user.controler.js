import asyncHeandler from "../utils/asyncHeandler.js";

const registerUser = asyncHeandler( async ( req, res ) => {
    res.status(200).json({
        message: "ok"
    })
} )

export {registerUser};