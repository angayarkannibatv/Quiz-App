const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
var mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


app.post('/send-email', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const subject = req.body.subject;

  const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: 'baluangayar@gmail.com', // Replace with your email address
      pass: 'jwgutekoktduiwux' // Replace with your email password
    }
  });

  const mailOptions = {
    from: 'baluangayar@gmail.com',
    to: `${email}`, // Replace with recipient email address
    subject: `${subject}`,
    text: `${name}\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Error sending email',
        error: error.message
      });
    } else {
        res.json({
            success: true,
            message: 'Email sent successfully',
        });
    }
  });
});


app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

// Create a connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234"
});

// Connect to MySQL
con.connect(function(err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL!");

  // Create a new database named "quizdb"
  con.query("CREATE DATABASE IF NOT EXISTS quizdb", function (err, result) {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created");
      res.json({
        status: "success",
        text:"Database created successfully!"
      })
    }

    // Close the MySQL connection
    con.end(function(err) {
      if (err) {
        console.error("Error closing connection:", err);
      } else {
        console.log("Connection closed");
      }
    });
  });
});


});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});