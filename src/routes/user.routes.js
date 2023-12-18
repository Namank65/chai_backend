import { Router } from "express";
import { registerUser } from "../controllers/user.controler.js";
import {upload} from "../middlewares/Multer.MiddleWare.js"

const router = Router();

router.route("/register").post(
    // injecting middleware from multer
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },

        {
            name: "coverimage",
            maxCount: 1
        }
    ]),

    registerUser
    )

export default router;