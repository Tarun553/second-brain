import mongoose from "mongoose";
// user model
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
 });
 
 // tag model 
 const tagSchema = new mongoose.Schema({
     title: { type: String, required: true, unique: true }
 });
 
 const contentTypes = ['image', 'video', 'article', 'audio'];
 
 // content schema 
 const contentSchema = new mongoose.Schema({
     title: { type: String, required: true },
     link: { type: String, required: true },
     type: { type: String, enum: ['link', 'tweet', 'video', 'document'], required: true },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     tags: { type: [String], default: [] }
 });
 
 // link schema
 const linkSchema = new mongoose.Schema({
     hash: { type: String, required: true, unique: true },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
     // You can add more fields if needed
 });
 
 const content = mongoose.model("Content", contentSchema);
 const link = mongoose.model("Link", linkSchema);
 const tag = mongoose.model("Tag", tagSchema);
 const user = mongoose.model("User", userSchema);
 
 export { content, link, tag, user };