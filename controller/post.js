import post from "../model/post.json" assert { type: "json" };
import user from "../model/user.json" assert { type: "json" };
import { v4 as uuidV4 } from "uuid";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { writeFile } from "fs/promises";
//setting loaclDB
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const postDB = {
    post: post,
    setPost: function (post) {
        this.post = post;
    }
};
//create Post controller
export async function createPost(req, res) {
    const { content } = req.body;
    const { id, username } = req.user;
    const imageUrl = `http://localhost:3000/upload/${req.file.filename}`;
    const postId = uuidV4();
    //creating post
    const newPost = {
        postId: postId,
        author: username,
        authorId: id,
        content: content,
        image: imageUrl
    };
    //saving to the DB
    postDB.setPost([...postDB.post, newPost]);
    try {
        await writeFile(
            path.join(__dirname, "..", "model", "post.json"),
            JSON.stringify(postDB.post, null, 2)
        );
        res.status(201).json({ msg: "post created" });
    } catch (err) {
        console.log(err);
    }
}
//get all post
export function getAllPost(req, res) {
    const { post } = postDB;
    res.status(200).json({ post });
}
// get users post
export function getUserPosts(req, res) {
    const { userId } = req.params;
    const userPosts = postDB.post.filter(posts => posts.authorId === userId);
    if (userPosts.length === 0) {
        return res.status(404).json({ msg: "No posts found" });
    }
    res.status(200).json({ post: userPosts });
}
//friends post
export function getFriendPosts(req, res) {
    const { userId } = req.params;
    const findUser = user.find(user => user.id === userId);
    const friendPost = postDB.post.filter(post =>
        findUser.friends.includes(post.authorId)
    );
    if (friendPost.length === 0) {
        return res.status(200).json({ msg: "no friend post found" });
    }
    res.status(200).json({ friendPost });
}
// get a single post
export function getSinglePost(req, res) {
    const { postId } = req.params;
    if (!postId) {
        return res.sendStatus(400);
    }
    const findPost = postDB.post.find(post => post.postId === postId);
    if (!findPost) {
        return res.status(404).json({ msg: "no Post found" });
    }
    res.status(200).json({findPost})
}
