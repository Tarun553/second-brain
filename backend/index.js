// Updated express server with proper CORS configuration

import express from "express";
import { random } from "./utils.js";
import jwt from "jsonwebtoken";
import { content, link, tag, user } from "./model/model.js";
import { verifyToken } from "./middleware/middleware.js";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

// THIS IS THE KEY FIX: Properly configured CORS
app.use(cors({
    // Explicitly specify allowed origins instead of using a function
    origin: [
        'https://second-brain-2-paw6.onrender.com', 
        'http://localhost:5173'
    ],
    // No credentials mode required if you're just using Bearer tokens
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Route 1: User Signup
app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await user.create({ username, password: bcrypt.hashSync(password, 10) });
        res.json({ message: "User signed up" });
    } catch (e) {
        res.status(409).json({ message: "User already exists" });
    }
});

// Route 2: User Signin
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await user.findOne({ username });
    if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(403).json({ message: "Incorrect credentials" });
    }
});

// Route 3: Add Content
app.post("/api/v1/content", verifyToken, async (req, res) => {
    try {
        console.log("Content creation request:", req.body);
        const { link, type, title, tags = [] } = req.body;
        
        const newContent = await content.create({
            link,
            type,
            title,
            userId: req.userId, // Set by middleware
            tags: tags
        });
        
        console.log("Content created successfully:", newContent);
        res.json({ message: "Content added", content: newContent });
    } catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ message: "Error adding content" });
    }
});

// Route 4: Get User Content
app.get("/api/v1/content", verifyToken, async (req, res) => {
    try {
        const userContent = await content.find({ userId: req.userId }).populate("userId", "username");
        res.json(userContent);
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Error fetching content" });
    }
});

// Route 5: Delete User Content
// FIXED: Use URL parameter instead of body
app.delete("/api/v1/content/:contentId", verifyToken, async (req, res) => {
    try {
        const contentId = req.params.contentId;
        const result = await content.deleteOne({ _id: contentId, userId: req.userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Content not found or unauthorized" });
        }
        
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Error deleting content" });
    }
});

// Route 6: Share Content Link
app.post("/api/v1/brain/share", verifyToken, async (req, res) => {
    try {
        const { share } = req.body;
        
        if (share) {
            const existingLink = await link.findOne({ userId: req.userId });
            
            if (existingLink) {
                return res.json({ hash: existingLink.hash });
            }
            
            const hash = random(10);
            await link.create({ userId: req.userId, hash });
            res.json({ hash });
        } else {
            await link.deleteOne({ userId: req.userId });
            res.json({ message: "Removed link" });
        }
    } catch (error) {
        console.error("Error sharing content:", error);
        res.status(500).json({ message: "Error sharing content" });
    }
});

// Route 7: Get Shared Content
// FIXED: Removed verifyToken middleware since this should be public
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    try {
        const hash = req.params.shareLink;
        
        const foundLink = await link.findOne({ hash });
        if (!foundLink) {
            return res.status(404).json({ message: "Invalid share link" });
        }
        
        const sharedContent = await content.find({ userId: foundLink.userId });
        const foundUser = await user.findOne({ _id: foundLink.userId });
        
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({
            username: foundUser.username,
            content: sharedContent
        });
    } catch (error) {
        console.error("Error getting shared content:", error);
        res.status(500).json({ message: "Error getting shared content" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});