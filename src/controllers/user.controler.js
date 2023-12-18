import {asyncHeandler} from "../utils/asyncHeandler.js";

const registerUser = asyncHeandler( async ( req, res ) => {
    res.status(200).json({
        message: "Backend With Chai Or Code"
    })
} )

export {registerUser};