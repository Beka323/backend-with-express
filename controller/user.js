import user from "../model/user.json" assert { type: "json" };
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { writeFile } from "fs/promises";
import BadRequest from "../errors/badRequest.js";
//setting the localDB
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDB = {
    user: user,
    setUser: function (data) {
        this.user = data;
    }
};
// get User profile
export function getUsers(req, res) {
    const { id, username } = req.user;
    const findUser = userDB.user.find(user => user.id === id);
    if (!findUser) {
        return res.status(404).json({ msg: "no user found" });
    }
    const formatUser = {
        id: findUser.id,
        email: findUser.email,
        username: findUser.username
    };
    res.status(200).json({ user: formatUser });
}
// get user friends
export function getUserFriend(req, res) {
    const { userId } = req.params;
    if (!userId) {
        throw new BadRequest("userId not Provided");
    }
    const findUser = userDB.user.find(user => user.id === userId);
    const friends = findUser.friends.filter(user => user);
    const findFriends = userDB.user.filter(user =>
        findUser.friends.includes(user.id)
    );
    res.status(200).json({ findFriends });
}
//add or remove friends
export async function addRemoveFriend(req, res) {
    const { userId, friendId } = req.params;
    const findUser = userDB.user.find(user => user.id === userId);
    if (findUser.friends.includes(friendId)) {
        const removeFriend = findUser.friends.filter(
            userId => userId !== friendId
        );
        const otherUser = userDB.user.filter(users => users.id !== findUser.id);
        const formattedUser = {
            id: findUser.id,
            email: findUser.email,
            username: findUser.username,
            password: findUser.password,
            friends: removeFriend,
            refreshToken: findUser.refreshToken
        };
        userDB.setUser([...otherUser, formattedUser]);
        try {
            await writeFile(
                path.join(__dirname, "..", "model", "user.json"),
                JSON.stringify(userDB.user, null, 2)
            );
            return res.status(200).json({ msg: "friend removed" });
        } catch (err) {
            console.log(err);
        }
    } else {
        userDB.user.map(user => {
            if (user.id === userId) {
                user.friends.push(friendId);
            }
            return user;
        });
        try {
            await writeFile(
                path.join(__dirname, "..", "model", "user.json"),
                JSON.stringify(userDB.user, null, 2)
            );
            return res.status(200).json({ msg: "friend add" });
        } catch (err) {
            console.log(err);
        }
    }
}
