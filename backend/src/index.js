import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
dotenv.config();
import {initDB} from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser()); // to parse cookies from the request

app.use("/api/auth", authRoutes)
app.use("/api/messages",messageRoutes);

//setup callback that is, when DB is initialized, run the app at port.
initDB().then(() => {
    app.listen(PORT, ()=>{
        console.log("Server is running on port 5001")
    });
});