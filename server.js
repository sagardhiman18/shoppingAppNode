const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserSchema = require("./model/user.model");
var nodemailer = require('nodemailer');
var sendgridTransport = require('nodemailer-sendgrid-transport');


app.use(express.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Pass to next layer of middleware
    next();
});

const transporter = nodemailer.createTransport(sendgridTransport ({
    auth:{
        api_key: "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"
    }
}))

app.get("/", (req, res) => {
    res.send(`<h1> Happy Coding ! </h1>`);
});

app.post("/auth/register", async (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let password =  req.body.password;
    let confirmPassword = req.body.confirmPassword;
    
    const user = await UserSchema.find({ name });
    //console.log(user);

    if (user.length > 0) {
        res.json({
            status: 400,
            message: "Username already exists",
        });
    } else {
        if (password !== confirmPassword) {
            res.json({
                status: 400,
                message: "Password not matched",
            });
        } else {
            bcrypt.hash(password, 8, function (err, hash) {
                if (err) {
                    throw err;
                }
                //console.log(hash);
                let user = new UserSchema({ password: hash, name, phone, email });
                user.save(function (err) {
                    if (err) {
                        res,json({
                            status: 400,
                            message: err,
                        });
                    } else {
                        res.json({
                            status: 200,
                            message: "User created successfully",
                        });
                    }
                });
            });
        }
    }

});


app.post("/auth/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    const user = await UserSchema.find({ email });
    if (user.length === 0) {
        res.json({
            status: 404,
            message: "User not exists",
        });
    } else {
        let doMatch = bcrypt.compareSync(password, user[0].password);

        if (!doMatch) {
            res.json({
                status: 400,
                message: "Invalid Credentials",
            });
        } else {
            res.json({
                status: 200,
                message: "Login Successfull"
            });
        }
    }
});


app.post("/auth/forgotPassword", async (req, res) => {
    let email = req.body.email;
    const token = Math.random() * 10000000000000000000;
    const tokenExpireTime = Date.now() + 10;
    
    const user = await UserSchema.find({ email });

    if (user.length === 0) {
        res.json({
            status: 400,
            message: "Invalid Email",
        })
    } else {

        UserSchema.updateOne(
            { username },
            { resetKey: token, tokenExpireTime },
            function (err) {
              if (err) {
                res.json({
                  code: 400,
                  message: err,
                });
              } else {
                    var options = {
                        to: email,
                        from: "dhimansagar007@gmail.com",
                        subject: "Hello World",
                        html: `<p> To reset your password click on the link  <a href="http://localhost:3000/reset/${token}"> Click Me </a> </p>`,
                    };

                    transporter.sendMail(options, function(err, info){
                        if (err ){
                        console.log(error);
                        }
                        else {
                        console.log('Message sent');
                        res.json({
                            status: 200,
                            message: "A link send to your mail",
                        })
                        }
                    });   
                }  
        }
        );
    }
});


app.post("/auth/resetPassword", async (req, res) => {
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let resetKey = req.body.resetKey;
    const user = await UserSchema.find({ resetKey });
  
    if (user.length === 0) {
      res.json({
        status: 400,
        message: "Reset key expired!",
      });
    } else {
      if (password !== confirmPassword) {
        res.json({
          status: 400,
          message: "Password mismatch!",
        });
      } else {
        bcrypt.hash(password, 8, function (err, hash) {
          if (err) {
            throw err;
          }
  
          UserSchema.updateOne(
            { username: user[0].username },
            { resetKey: "invalid", password: hash },
            function (err) {
              if (err) {
                res.json({
                  message: err,
                  code: 400,
                });
              } else {
                res.json({
                  message: "Password has been reset successfully",
                  code: 200,
                });
              }
            }
          );
        });
      }
    }
  });


mongoose
    .connect(
        "mongodb+srv://admin:admin@cluster0.ndg6k.mongodb.net/shoppingapp?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    ).then((res) => {
        app.listen(8005);
    });
