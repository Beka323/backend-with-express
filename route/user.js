import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
    getUsers,
    getUserFriend,
    addRemoveFriend
} from "../controller/user.js";
const userRoute = express.Router();
//get user information
userRoute.get("/profile", verifyToken, getUsers);
// get users friend list
userRoute.get("/:userId/friends", verifyToken, getUserFriend);
// add or remove friends
userRoute.patch("/:userId/:friendId", verifyToken, addRemoveFriend);
export default userRoute;
