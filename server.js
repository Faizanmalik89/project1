const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let users = {};

app.post("/register", (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000);
    users[email] = { otp };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-email-password"
        }
    });

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send("Error sending OTP");
        }
        res.send("OTP sent! Check your email.");
    });
});

app.post("/verify", (req, res) => {
    const { email, otp } = req.body;
    if (users[email] && users[email].otp == otp) {
        res.send("OTP Verified! You can now log in.");
    } else {
        res.send("Invalid OTP");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});