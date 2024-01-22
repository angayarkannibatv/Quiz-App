const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});