import express from "express";
import { verifyMail } from "../controllers/users.js";
const userRoute = express();

userRoute.set("view engine", "ejs");
userRoute.set("views", "./views");
userRoute.use(express.static("public"));

userRoute.get("/verify", verifyMail);

export default userRoute;
