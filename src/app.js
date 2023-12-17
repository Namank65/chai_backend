import express, { urlencoded } from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieparser());

// importing routes

import userRouter from "./routes/user.routes.js";

// route diclration

export {app};

