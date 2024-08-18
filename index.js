import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import "dotenv/config";
//Route
import authRoute from "./route/auth.js";
import userRoute from "./route/user.js";
import postRoute from "./route/post.js";
//custom middlewares
import handleError from "./middleware/handleError.js";
import verifyToken from "./middleware/verifyToken.js";
import notFound from "./middleware/not-found.js";

const app = express();
const port = process.env.PORT || 3500;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//Routes
app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);

//Not found
app.use(notFound);
//HandleErrors
app.use(handleError);
app.listen(port, console.log(`server is running on port: ${port}`));
