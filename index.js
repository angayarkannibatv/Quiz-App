const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const randomString = require('randomized-string');
const { generateFromEmail } = require("unique-username-generator");
const moment = require('moment');

const app = express();
const port = 3000;
const saltRounds = 9;

app.use(bodyParser.json());
app.use(cors());


const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

app.post('/send-email', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'baluangayar@gmail.com', // Replace with your email address
      pass: 'jwgutekoktduiwux' // Replace with your email password
    }
  });

  transporter.sendMail(req.body, (error, info) => {
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

app.post('/email-confirmation', (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: 'quizdb'
  });

  con.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }

    
    con.query(`UPDATE students
    JOIN email_token ON students.id = email_token.user_id
    SET students.email_confirmed = ?, students.updated_at = ?
    WHERE students.id = ? AND email_token.token = ?`, [1, `${currentDate}`, req.body.user_id, req.body.token], (updateErr) => {
      if (updateErr) {
        console.error('Error updating email confirmation:', updateErr);
        res.json({
          statusCode: 500,
          status: false,
          message: 'Email not found'
        });
      } else {
        res.json({
          statusCode: 200,
          status: true,
          message: 'Email confirmed successfully!',
        });
      }
      con.end();
    });
  });
})

app.post('/check-email-token', (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: 'quizdb'
  });

  con.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }

    con.query('SELECT * FROM students WHERE id = ?', [req.body.user_id], (selectErr, results) => {
      if (selectErr) {
        console.error('Error retrieving created_date:', selectErr);
        return;
      }

      if(results[0].email_confirmed === 0){
        const getCurrentTime = () => new Date();

        const selectQuery = 'SELECT created_at FROM email_token WHERE id = ?';
      
        con.query(selectQuery, [req.body.user_id], (selectErr, results) => {
          if (selectErr) {
            console.error('Error retrieving created_date:', selectErr);
            return;
          }
      
          if (results.length > 0) {
            const createdDate = new Date(results[0].created_date);
            const currentTime = getCurrentTime();
      
            // Calculate the time difference in milliseconds
            const timeDifference = currentTime - createdDate;
      
            // Convert 3 minutes to milliseconds
            const threeMinutesInMilliseconds = 3 * 60 * 1000;
      
            // Compare if the time difference is more than 3 minutes
            if (timeDifference > threeMinutesInMilliseconds) {
              console.log('Record is more than 3 minutes old.');
              res.json({
                statusCode:200,
                status: false,
                text:"Email token invalid"
              })
            } else {
              res.json({
                statusCode:200,
                status: true,
                text:"Email token valid"
              })
              console.log('Record is within the last 3 minutes.');
            }
          } else {
            console.log('No record found with the specified ID.');
          }
      
          
        });
      }else{
        res.json({
          statusCode: 200,
          status: true,
          text: "Email already confirmed"
        })
      }
      // Close the database connection
      con.end();
    });
  });
})

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "quizdb"
  });

  // Connect to MySQL
  con.connect(function (err) {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    
    con.query(`CREATE DATABASE IF NOT EXISTS quizdb`, function (err, result) {
      if (err) {
        console.error("Error creating database:", err);
      } else {
        console.log("Database created");
        con.query(`USE quizdb`, (err) => {
          if (err) {
            console.error('Error selecting database: ' + err.stack);
            return;
          }

          const createTableQuery = `CREATE TABLE IF NOT EXISTS students (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255),
              username VARCHAR(255),
              email VARCHAR(255),
              password VARCHAR(255),
              hashedPassword LONGTEXT,
              salt INT,
              email_confirmed bit,
              created_at datetime,
              updated_at datetime
            )`;
          con.query(createTableQuery, (err) => {
            if (err) {
              console.error('Error creating table: ' + err.stack);
              return;
            }

            const username = generateFromEmail( `${email}`, 3 );

            console.log('Table created or already exists');
            bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
              if (hashErr) {
                console.error('Error hashing password: ' + hashErr);
                connection.end();
                return;
              }
          
            const insertRecordQuery = 'INSERT INTO students (name, username, email, password, hashedPassword, salt, email_confirmed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [`${name}`,`${username}`, `${email}`, `${password}`, `${hashedPassword}`, `${saltRounds}`, 0, `${currentDate}`, null];

            con.query(insertRecordQuery, values, (err, results) => {
              if (err) {
                console.error('Error inserting record: ' + err.stack);
                return;
              }
              res.json({
                statusCode: 200,
                status: true,
                text: "Record inserted successfully!",
                result: results
              })
            });

            con.end(function (err) {
              if (err) {
                console.error("Error closing connection:", err);
              } else {
                console.log("Connection closed");
              }
            });
          });
          });
        });
      }
    });
  });
});

app.post('/generate-token', (req, res) => {
  const id = req.body.id;
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "quizdb"
  });

  con.connect(function (err) {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
        
      con.query(`USE quizdb`, (err) => {
        if (err) {
          console.error('Error selecting database: ' + err.stack);
          return;
        }

        const query = `CREATE TABLE IF NOT EXISTS email_token (
            id INT AUTO_INCREMENT PRIMARY KEY,
            token VARCHAR(255),
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES students(id),
            created_at datetime,
            updated_at datetime
          )`;
        con.query(query, (err) => {
          if (err) {
            console.error('Error creating table: ' + err.stack);
            return;
          }

          const email_token = randomString.generate(100); 

          console.log('Table created or already exists');
        
          const insert_query = 'INSERT INTO email_token (user_id, token, created_at, updated_at) VALUES (?, ?, ?, ?)';
          const values = [`${id}`,`${email_token}`,`${currentDate}`, null];

          con.query(insert_query, values, (err, results) => {
            if (err) {
              console.error('Error inserting record: ' + err.stack);
              return;
            }

            console.log('token generated');
            res.json({
              statusCode: 200,
              status: true,
              text: "Token saved successfully!",
              result: results,
              email_token: email_token
            })
          });

          con.end(function (err) {
            if (err) {
              console.error("Error closing connection:", err);
            } else {
              console.log("Connection closed");
            }
          });
        });
      });
    });
});

app.post('/update-email-token', (req, res) => {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: 'quizdb'
  });

  con.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }

    const email_token = randomString.generate(100); 
    con.query(`UPDATE email_token SET token = ?, updated_at = ? WHERE user_id = ?`, 
        [email_token, `${currentDate}`, req.body.user_id], (updateErr) => {
      if (updateErr) {
        console.error('Error updating email confirmation:', updateErr);
        res.json({
          statusCode: 500,
          status: false,
          message: 'Email not found'
        });
      } else {
        res.json({
          statusCode: 200,
          status: true,
          message: 'Email confirmed successfully!',
        });
      }
      con.end();
    });
  });
})

app.post('/email-exists', (req, res) => {
  con.query(`USE quizdb`, (err) => {
    if (err) {
      console.error('Error selecting database: ' + err.stack);
      return;
    }

    const query = 'SELECT COUNT(*) AS count FROM students WHERE email = ?';
    con.query(query, [req.body.email], (err, results) => {
      if (err) {
        console.error('Error checking email existence:', err);
        res.json({
          statusCode: 500,
          status: true,
          text: "Error checking email existence"
        })
        return;
      }
  
      const emailCount = results[0].count;
      const exists = emailCount > 0;

      if(exists){
        res.json({
          statusCode: 200,
          status: true,
          text: "Email exists"
        })
      }else{
        res.json({
          statusCode: 200,
          status: false,
          text: "Email not exists"
        })
      }
      
    });
    con.end();
  });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});