import "dotenv/config";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { writeFile } from "fs/promises";
import bcrypt from "bcryptjs";
import user from "../model/user.json" assert { type: "json" };
import { v4 as uuidV4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import ConflictError from "../errors/conflictError.js";
// setting file dir and localDB
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDB = {
    user: user,
    setUser: function (data) {
        this.user = data;
    }
};
// signing accessToken
function AccessToken(id, username) {
    const token = jwt.sign({ id, username }, process.env.ACCESS_TOKEN);
    return token;
}
// signing refreshToken
function RefreshToken(id, username) {
    const token = jwt.sign({ id, username }, process.env.REFRESH_TOKEN);
    return token;
}
//register controller
export async function register(req, res) {
    const { email, username, password } = req.body;
    const id = uuidV4();
    try {
        // checking if the email exsist
        const findUser = userDB.user.find(user => user.email === email);
        if (findUser) {
            return res
                .status(StatusCodes.CONFLICT)
                .json({ msg: "user already exsist" });
        }
        // encrypting the password
        const salt = await bcrypt.genSalt(5);
        const hashPWD = await bcrypt.hash(password, salt);
        const newUser = {
            id: id,
            email: email,
            username: username,
            password: hashPWD,
            friends: []
        };
        //saving user to localDB
        userDB.setUser([...userDB.user, newUser]);
        await writeFile(
            path.join(__dirname, "..", "model", "user.json"),
            JSON.stringify(userDB.user, null, 2)
        );
        res.status(201).json({ msg: "user created" });
    } catch (err) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Error occured" });
    }
}
//Login controller
export async function login(req, res) {
    const { email, password } = req.body;
    //checking if the user exsist
    const findUser = userDB.user.find(user => user.email === email);
    if (!findUser) {
        return res.status(StatusCodes.BAD_REQUEST);
    }
    const match = await bcrypt.compare(password, findUser.password);
    if (match) {
      //signing accessToken and refreshToken
        const accessToken = AccessToken(findUser.id, findUser.username);
        const refreshToken = RefreshToken(findUser.id, findUser.username);
        // Saving the refresh token
        //svaing user with refresh token
        const otherUser = userDB.user.filter(
            user => user.email !== findUser.email
        );
        const authUser = { ...findUser, refreshToken };
        userDB.setUser([...otherUser, authUser]);
        try {
            await writeFile(
                path.join(__dirname, "..", "model", "user.json"),
                JSON.stringify(userDB.user, null, 2)
            );
            return res.status(StatusCodes.OK).json({ accessToken });
        } catch (err) {
            console.log(err);
        }
    } else {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "incorrect password" });
    }
}
