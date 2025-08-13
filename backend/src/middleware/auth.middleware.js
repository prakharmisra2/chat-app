import jwt from 'jsonwebtoken';
import { sql } from '../config/db.js';

export const protectRoute = async (req, res, next) => {
    

    try {

        const token = req.cookies.jwt;
    
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        console.log('Decoded token:', decoded);
        console.log('User ID from token:', userId);
        if(!decoded || !userId) {
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }
        // Fetch user from the database
        const user = await sql`SELECT name, email, profilepic, created_at, updated_at  FROM users WHERE id = ${userId}`;

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user[0]; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in protectRoute middleware', error.message);
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
}