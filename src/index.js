import ConnectDB from "./DB/index.js";
import dotenv from "dotenv";
import { app } from "./app.js"; 

dotenv.config({
    path: "./env"
});

// FIRST APPROACH is in DB folder in index file
ConnectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on the Port: ${process.env.PORT}`)
    } )
})
.catch((err) => {
    console.log("MongoDB Connection Failed  !!! ", err)
});


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