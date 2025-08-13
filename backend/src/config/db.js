import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv";
// database connections 
dotenv.config();

const {PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;

//creates a sql connection using env variables.
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`
)
