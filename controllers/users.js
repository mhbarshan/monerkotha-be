import { db } from "../db.js";

export const verifyMail = (req, res) => {
  var token = req.query.token;

  db.query(
    "SELECT * FROM users where token=? limit 1",
    token,
    function (err, result, data) {
      if (err) {
        console.log(err);
      }

      if (result.length > 0) {
        db.query(
          `UPDATE users SET token = null , is_verified = 1 WHERE id= '${result[0].id}'`
        );
        return res.render("verification", {
          message: "Mail verified successfully!",
        });
      } else {
        return res.render("404");
      }
    }
  );
};
