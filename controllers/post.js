import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const getPosts = (req, res) => {
  const query = req.query.cat
    ? "SELECT * from posts WHERE category=?"
    : "SELECT * FROM posts";

  db.query(query, [req.query.cat], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const query =
    "SELECT p.id, `username`, `title` ,`heading` , p.image, u.image AS userImage, `description`, `category`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ? ";
  db.query(query, [req.params.id], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "authkeyjwt", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const query =
      "INSERT INTO posts(`title`, `heading`,`description`, `image`, `category`, `date`, `uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.heading,
      req.body.description,
      req.body.image,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(query, [values], (err, data) => {
      if (err) return res.status(501).json(err);

      return res.json("Posted Successfully");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "authkeyjwt", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const query = "DELETE FROM posts WHERE id = ? AND uid= ?";
    db.query(query, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post");

      return res.json("Post has been deleted");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "authkeyjwt", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const query =
      "UPDATE posts SET`title`=?, `heading`=?,`description`=?, `image`=?, `category`=? WHERE id=? AND uid=?";

    const values = [
      req.body.title,
      req.body.heading,
      req.body.description,
      req.body.image,
      req.body.cat,
    ];

    db.query(query, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(501).json(err);

      return res.json("Post Updated Successfully");
    });
  });
};
