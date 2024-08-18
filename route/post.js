import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import validator from "../middleware/validator.js";
import multer from "multer";
import {
    createPost,
    getAllPost,
    getUserPosts,
    getFriendPosts,
    getSinglePost
} from "../controller/post.js";
import postSchema from "../schema/postSchema.js";

const postRoute = express.Router();
//image upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
//get all post
postRoute.get("/posts", verifyToken, getAllPost);
//get users post
postRoute.get("/:userId/posts", verifyToken, getUserPosts);
//get friends post
postRoute.get("/:userId/friend-post", verifyToken, getFriendPosts);
// get single post
postRoute.get("/:postId", verifyToken, getSinglePost);
//create new post
postRoute.post(
    "/create-post",
    verifyToken,
    upload.single("image"),
    validator(postSchema),
    createPost
);

export default postRoute;
