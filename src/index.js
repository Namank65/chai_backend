import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

// FIRST APPROACH 
















// SECOND APPROACH
// const app = express();
// ;( async() => {
//     try {
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//       app.on("Error", (err) => {
//         console.log(`Error: ${err}`)
//         throw err;
//       })

//       app.listen(process.env.PORT, () => {
//         console.log(`The App is listining on the port ${process.env.PORT}`)
//       })
//     } catch (err) {
//         console.log(`Error: ${err}`)
//         throw err;
//     }
// })()