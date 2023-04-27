import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { db } from "../db.js";
import sendMail from "../utilities/sendMail.js";

export const register = (req, res) => {
  //CHECK User validation
  const query = "SELECT * FROM users WHERE email = ? or username = ?";

  db.query(query, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists");

    //hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const query =
      "INSERT INTO users (`username`,`image`, `email`,`password`) VALUES(?)";
    const values = [req.body.username, req.body.image, req.body.email, hash];

    db.query(query, [values], (err, data) => {
      if (err) return res.json(err);

      let mailSubject = "Mail verification";
      const randomToken = randomstring.generate();

      let content =
        "<p>Hi " +
        req.body.username +
        ',Please \
      <a href="http://localhost:8800/verify?token=' +
        randomToken +
        '">Click</a> here to verify your account</p>';
      sendMail(req.body.email, mailSubject, content);

      db.query(
        "UPDATE users SET token=? WHERE email=?",
        [randomToken, req.body.email],
        (err, data) => {
          if (err) return res.json(err);
        }
      );

      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
  //check user

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    if (data[0].is_verified === 0)
      return res
        .status(400)
        .json("Check your registered Email & Verify First!");

    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "authkeyjwt");
    const { password, ...other } = data[0];
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(data[0]);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
