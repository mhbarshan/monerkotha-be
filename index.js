import cookieParser from "cookie-parser";
import express from "express";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";
import webRoutes from "./routes/webRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  return res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postRoutes);
app.use("/", webRoutes);

app.listen(8800, () => {
  console.log("Connected");
});
