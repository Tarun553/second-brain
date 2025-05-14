import jwt from "jsonwebtoken";
import { user } from "../model/model.js";

export const verifyToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists
        const foundUser = await user.findById(decoded.id);
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Add userId to the request object for use in route handlers
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        
        res.status(500).json({ message: "Authentication failed" });
    }
};