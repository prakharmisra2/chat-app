import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv";
import { userModel } from "../models/user.model.js";
import { messageModel } from "../models/message.model.js";

// database connections 
dotenv.config();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;

//creates a sql connection using env variables.
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`
)

export const initDB = async () => {
    userModel(sql);
    messageModel(sql);
}