import nodemailer from "nodemailer";
import * as dotenv from 'dotenv' 
dotenv.config()
//const nodemailer =require('nodemailer')
const SMTP_MAIL = process.env.SMTP_MAIL;
const SMTP_PASS = process.env.SMTP_PASS;
const sendMail = async (email, mailSubject, content) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_MAIL,
      to: email,
      subject: mailSubject,
      html: content,
    };

    transport.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Mail Sent", data.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
export default sendMail;
