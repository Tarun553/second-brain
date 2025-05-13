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
app.use(express.json()); // Middleware to parse JSON request bodies.
app.use(cors()); // Middleware to allow cross-origin requests.

// Route 1: User Signup
app.post("/api/v1/signup", async (req, res) => {
    // TODO: Use zod or a similar library for input validation.
    // TODO: Hash the password before storing it in the database.
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Create a new user with the provided username and password.
        await user.create({ username, password: bcrypt.hashSync(password, 10) });
        res.json({ message: "User signed up" }); // Send success response.
    } catch (e) {
        // Handle errors like duplicate usernames.
        res.status(409).json({ message: "User already exists" }); // Conflict status.
    }
});

// Route 2: User Signin
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
     const password = req.body.password;

    // Find a user with the provided credentials.
    const existingUser = await user.findOne({ username });
    if (existingUser && bcrypt.compareSync(password, existingUser.password)) {
        // Generate a JWT token with the user's ID.
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
        res.json({ token }); // Send the token in response.
    } else {
        // Send error response for invalid credentials.
        res.status(403).json({ message: "Incorrect credentials" });
    }
});

// Route 3: Add Content
app.post("/api/v1/content", verifyToken, async (req, res) => {
    const { link, type, title } = req.body;
    // Create a new content entry linked to the logged-in user.
    await  content.create({
        link,
        type,
        title,
        userId: req.userId, // userId is added by the middleware.
        tags: [] // Initialize tags as an empty array.
    });

    res.json({ message: "Content added" }); // Send success response.
});

// Route 4: Get User Content
app.get("/api/v1/content", verifyToken, async (req, res) => {
    const userId = req.user._id;
    const userContent = await content.find({ userId: userId }).populate("userId", "username");
    res.json(userContent);
});

// Route 5: Delete User Content
app.delete("/api/v1/content", verifyToken, async (req, res) => {
    const contentId = req.body.contentId;

    // Delete content based on contentId and userId.
    await content.deleteMany({ contentId, userId: req.user._id });
    res.json({ message: "Deleted" }); // Send success response.
});

// Route 6: Share Content Link
app.post("/api/v1/brain/share", verifyToken, async (req, res) => {
    const { share } = req.body;
    if (share) {
        // Check if a link already exists for the user.
        const existingLink = await link.findOne({ userId: req.user._id });
        if (existingLink) {
            res.json({ hash: existingLink.hash }); // Send existing hash if found.
            return;
        }

        // Generate a new hash for the shareable link.
        const hash = random(10);
        await link.create({ userId: req.user._id, hash });
        res.json({ hash }); // Send new hash in the response.
    } else {
        // Remove the shareable link if share is false.
        await link.deleteOne({ userId: req.user._id });
        res.json({ message: "Removed link" }); // Send success response.
    }
});

// Route 7: Get Shared Content
app.get("/api/v1/brain/:shareLink", verifyToken, async (req, res) => {
    const hash = req.params.shareLink;

    // Find the link using the provided hash.
    const foundLink = await link.findOne({ hash });
    if (!foundLink) {
        res.status(404).json({ message: "Invalid share link" });
        return;
    }
    
    // Fetch content and user details for the shareable link.
    const sharedContent = await content.find({ userId: foundLink.userId });
    const foundUser = await user.findOne({ _id: foundLink.userId });
    
    if (!foundUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    
    res.json({
        username: foundUser.username,
        content: sharedContent
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

