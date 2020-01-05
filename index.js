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

// LOGIN. Receive email and pass and send the user data back.

// I'm making a POST request since I'm sending some params from the front-end.
// The params are found in req.body.yourParam, and they depend on how you sent them from React.
// In my case, when I want to login, I have two inputs, email and pass, so I will receive and object with these keys.

// To use this api, front-end will make a request on localhost:3000/login with a json object containing the params.
app.post("/login", function(req, res) {
  // req is request, what comes, res is response what goes

  // { "email": "bogdan.test@trackit.com", "pass": "123abc" } - my request for the login. I created this user from the mongo command line.

  // findOne finds the first occurence. Using find will return an array.
  // I'm searching for an object with the email key equal with the one front-end sent me.
  // findOne receives an object to query after and a callback function where the result is handled.

  db.collection("users").findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      res.statusCode = 500; // 5xx are errors on server's side. 500 is Internal Server Error.
      res.send({ msg: "Something went wrong!" }); // Always send a respons to avoid a timeout error.

      console.log(err); // Also, print the error to debug.

      throw err; // the rest has no point in being executed
    }

    console.log(result);

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

// REGISTER. Receive an email and pass, save the user in the database and send the saved data back.

app.post("/register", function(req, res) {
  db.collection("users").findOne({ email: req.body.email }, function(
    err,
    result
  ) {
    if (err) {
      res.statusCode = 500;
      res.send({ msg: "Something went wrong!" });

      console.log(err);

      throw err;
    }

    console.log(result);

    if (result) {
      res.statusCode = 400; // Bad request
      res.send({
        msg: "An account already exists on this email! Use the login! "
      });
    } else {
      // save the new user
      db.collection("users").insert(
        { email: req.body.email, pass: req.body.pass },
        function(err, obj) {
          // maybe something went wrong on the write operation
          if (err) {
            res.statusCode = 500;
            res.send({ msg: "Something went wrong!" });

            console.log(err);

            throw err;
          }

          console.log(obj); // the object also contains some status codes, number of rows inserted etc. We want only the stored data. It is found in the ops[0] key. [0] first element of the result because you can store whole arrays.

          res.statusCode = 201; // Created
          res.send({
            _id: obj.ops[0]._id,
            email: obj.ops[0].email
          });
        }
      );
    }
  });
});

// EVENTS. Do stuff
app.post("/login", function(req, res) {
  // req is request, what comes, res is response what goes

  // { "email": "bogdan.test@trackit.com", "pass": "123abc" } - my request for the login. I created this user from the mongo command line.

  // findOne finds the first occurence. Using find will return an array.
  // I'm searching for an object with the email key equal with the one front-end sent me.
  // findOne receives an object to query after and a callback function where the result is handled.

  db.collection("users").findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      res.statusCode = 500; // 5xx are errors on server's side. 500 is Internal Server Error.
      res.send({ msg: "Something went wrong!" }); // Always send a respons to avoid a timeout error.

      console.log(err); // Also, print the error to debug.

      throw err; // the rest has no point in being executed
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

// CALENDAR

app.post("/events", function(req, res) {
  db.collection("events").insert(
    { userId: req.body.userId, date: req.body.date, event: req.body.event },
    function(err, obj) {
      // maybe something went wrong on the write operation
      if (err) {
        res.statusCode = 500;
        res.send({ msg: "Something went wrong!" });

        console.log(err);

        throw err;
      }

      res.statusCode = 201; // Created
      res.send({
        event: obj.ops[0]
      });
    }
  );
});

app.get("/events", function(req, res) {
  db.collection("events")
    .find({
      userId: req.query.userId,
      date: req.query.date
    })
    .toArray(function(err, result) {
      if (err) {
        res.statusCode = 500;
        res.send({ msg: "Something went wrong!" });

        console.log(err);

        throw err;
      }

      res.statusCode = 200;
      res.send({
        events: result
      });
    });
});

app.delete("/events/:id", function(req, res) {
  db.collection("events").remove(
    {
      _id: new mongodb.ObjectID(req.params.id)
    },
    function(err, obj) {
      if (err) return console.log(err);

      console.log(obj.result.n + " record(s) deleted");

      res.send({
        _id: req.params.id
      });
    }
  );
});

// WATER TRACKER

app.get("/water", function(req, res) {
  db.collection("water")
    .find({
      userId: req.query.userId,
      date: req.query.date
    })
    .toArray(function(err, result) {
      if (err) {
        res.statusCode = 500;
        res.send({ msg: "Something went wrong!" });

        console.log(err);

        throw err;
      }

      totalAmount = 0;
      result.forEach(entry => (totalAmount += entry.amount));

      res.statusCode = 200;
      res.send({
        totalAmount: totalAmount
      });
    });
});

app.post("/water", function(req, res) {
  db.collection("water").insert(
    {
      userId: req.body.userId,
      date: req.body.date,
      amount: req.body.amount
    },
    function(err, obj) {
      if (err) {
        res.statusCode = 500;
        res.send({ msg: "Something went wrong!" });

        console.log(err);

        throw err;
      }

      res.statusCode = 201; // Created
      res.send({
        date: obj.ops[0].date,
        amount: obj.ops[0].amount
      });
    }
  );
});
