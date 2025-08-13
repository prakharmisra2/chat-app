import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
dotenv.config();
import {sql} from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser()); // to parse cookies from the request

app.use("/api/auth", authRoutes)

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS users (
            id  SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            profilePic VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
        console.log("database initialized");
    } catch(e) {
        console.log("Error initDB", e);
    }
}

//setup callback that is, when DB is initialized, run the app at port.
initDB().then(() => {
    app.listen(PORT, ()=>{
        console.log("Server is running on port 5001")
    });
});