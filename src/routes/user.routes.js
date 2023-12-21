import { Router } from "express";
import { LoginUser, LogoutUser, registerUser } from "../controllers/user.controler.js";
import { upload } from "../middlewares/Multer.MiddleWare.js"
import { VerifyJWT } from "../middlewares/Auth.middleware.js";

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
);

router.route("/login").post(LoginUser);

// Secured routes
router.route("/logout").post(VerifyJWT, LogoutUser);

export default router;