import {sql} from "../config/db.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the request object
        console.log('User ID:', userId);

        // Fetch users for the sidebar excluding the current user
        const users = await sql`
            SELECT id, name, email, profilepic, created_at, updated_at 
            FROM users 
            WHERE id != ${userId}
            ORDER BY created_at DESC
        `;

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users for sidebar:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
 try {
        const {id:userToChatId} = req.params; // Get user ID from request parameters
        const senderId = req.user.id; // Get current user ID from the request object

        const message = await sql`
            SELECT * FROM messages 
            WHERE (sender_id = ${senderId} AND receiver_id = ${userToChatId}) 
               OR (sender_id = ${userToChatId} AND receiver_id = ${senderId}) 
            ORDER BY created_at ASC
        `;

        res.status(200).json(message);
 }catch (error){
        console.error('Error fetching messages:', error.message);
        res.status(500).json({ message: 'Internal server error' });
 }
};

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body; // Get message content from request body
        const senderId = req.user.id; // Get current user ID from the request object
        const {id:receiverId} = req.params; // Get receiver ID from request parameters

        let imageUrl = null; 
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
        }
        // Insert the message into the database
        const newMessage = await sql`
            INSERT INTO messages (sender_id, receiver_id, content, image)
            VALUES (${senderId}, ${receiverId}, ${text}, ${imageUrl})
            RETURNING *
        `
        if (newMessage.length === 0) {
            return res.status(500).json({ message: 'Error sending message' });
        }
        res.status(201).json(newMessage[0]); // Return the newly created message
        //TODO: realtime functionality goes here 
    } catch(error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}
