import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utiils.js";
import {sql} from "../config/db.js";

export const signup = async (req,res) => {
    //TODO: validate input fields (non empty)
    const {fullName, email,password} = req.body
    try{
        //hash password
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        // Check if user already exists
        try {const user = await sql`
        SELECT * FROM users WHERE email = ${email}
        `

        if(user.length > 0){
            console.log("User already exists", user);
            return res.status(400).json({message: "User already exists"});
        }
        } catch(e) {
            console.log("error user fetch",error);
        }
        
        

        // Save user to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {const newUser = await sql`
            INSERT INTO users (name,email,password)
            VALUES (${fullName},${email},${hashedPassword})
            RETURNING *
        `
        if(newUser[0]){
            generateToken(newUser.id,res);
            return res.status(201).json({message: "User created successfully"});
        }else {
            return res.status(500).json({message: "Error creating user"});
        }
        } catch(error){
            console.log("error in creating user", error);
        }

        

    } catch(error){
        console.log("Error in signup", error.message);
    }
};

export const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        // Check if user exists
        try {
            const user = await sql`
            SELECT * FROM users WHERE email = ${email};
            `
            if(user.length === 0){
                return res.status(404).json({message: "Invalid credentials"});
            } else if(user[0].email !== email) {
                return res.status(400).json({message: "Invalid credentials"});
            }
            await bcrypt.compare(password, user[0].password).then((isMatch) => {
                if(!isMatch){
                    return res.status(400).json({message: "Invalid credentials"});
                } else {
                    generateToken(user[0].id, res);
                    return res.status(200).json({message: "Login successful"});
                }
            });

        } catch(error) {
            console.log("Error fetching user", error);
            return res.status(500).json({message: "Internal server error"});
        }   
    } catch(error){
        console.log("Error in login", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0, // Set cookie to expire immediately
            httpOnly: true, // Prevents JavaScript access to the cookie
            sameSite: 'Strict', // Helps mitigate CSRF attacks
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        });
        return res.status(200).json({message: "Logout successful"});

    } catch(error) {
        console.log("Error in logout", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const updateProfile = async (req, res) => {
    const {name, email, profilePic} = req.body;
    try {
        // Validate input fields
        if(!name || !email) {
            return res.status(400).json({message: "Name and email are required"});
        }

        // Update user in the database
        const updatedUser = await sql`
            UPDATE users
            SET name = ${name}, email = ${email}, profilepic = ${profilePic}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${req.user.id}
            RETURNING *
        `;
        // TODO: implement cloudinary for profile picture upload and update
        if(updatedUser.length === 0) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json({message: "Profile updated successfully", user: updatedUser[0]});
    } catch(error) {
        console.log("Error updating profile", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error){
        console.log("Error in checkAuth", error);
        return res.status(500).json({message: "Internal server error"});
    }
};
