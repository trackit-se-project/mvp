const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();

let db = null;

mongodb.MongoClient.connect("mongodb://localhost:27017/mvp", (err, client) => {
  if (err) return console.log(err);

  db = client.db("mvp");

  app.listen(3000, function() {
    console.log("Connected to database. MVP listening on port 3000!");
  });
});

app.use([cors(), bodyParser()]);

/*  USERS   */

// I'm making a POST request since I'm sending some params from the front-end.
// The params are found in req.body.yourParam, and they depend on how you sent them from React.
// In my case, when I want to login, I have two inputs, email and pass, so I will receive and object with these keys.

// To use this api, front-end will make a request on localhost:3000/users with a json object containing the params.

app.post("/users", function(req, res) {
  // req is request, what comes, res is response what goes

  // findOne finds the first occurence. Using find will return an array.
  // I'm searching for an object with the email key equal with the one front-end sent me.
  // findOne receives an object to query after and a callback function where the result is handled.

  db.collection("users").findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      res.statusCode = 500; // 5xx are errors on server's side. 500 is Internal Server Error.
      res.send({ msg: "Something went wrong!" }); // Always send a respons to avoid a timeout error.

      console.log(err); // Also, print the error to debug.
    }

    if (result) {
      if (result.pass == req.body.pass) {
        res.statusCode = 200; // 2xx are good codes, 200 is ok
        res.send({
          _id: result._id,
          email: result.email
        });
      } else {
        // 4xx codes are wrong on the client side. 401 is unauthorised. We want to tell the user the username/pass combination is wrong.

        res.statusCode = 401;
        res.send({ msg: "Wrong email or password!" });
      }
    } else {
      res.statusCode = 404; // not found
      res.send({ msg: "No account on this email address!" });
    }
  });
});
