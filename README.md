# Installation

### cmder (optional)

If you find it easier to work with a linux style type terminal, try [cmder](https://cmder.net/). It's an console emulator for Windows and it can have multiple tabs open which will be useful for later. It's all extract & run. Get the full version if you want to use it.

### MongoDB

Download [MongoDB](https://www.mongodb.com/download-center/enterprise) from here and select your OS. Get the `current release version` (most likely 4.2.2).

### Node.js

Download [Node.js](https://nodejs.org/en/download/) from here. Take the `LTS` version.

### Postman (optional)

I like developing the back-end first, but since I don't have a client who uses my api, I'm mocking the request with Postman. It's very easy to use and speeds up the process. You'll find Postman [here](https://www.getpostman.com/downloads/). I got the 64-bit version.

If you installed, to skip the sing-in process, you'll find some small shady text below the inputs which says 'Skip the process etc.'.

# Setup

### MongoDB

If you're on Windows, on your C: drive, create a folder <b>data</b> with a folder <b>db</b> inside of it. The <b>data</b> folder should be exactly on the root of the C: drive along Program Files, Users, Windows etc.

This [tutorial](https://www.tutorialspoint.com/mongodb/index.htm) contains pretty much all the necessary commands for mongo.

To enter the command line of mongo and create a new database, on Windows, if you chose the default installation path, go to <b>C:\Program Files\MongoDB\Server\4.2\bin</b> and run <b>mongo.exe</b>.

`use mvp` will create the <b>mvp</b> database and select it. <b>USE THIS NAME FOR THE DATABASE!</b>

`db` command should output <b>mvp</b>.

For me, <i>collectionName</i> is <b>users</b> for now, but you'll use <b>waterTracker</b>, <b>todos</b> or whatever.

To create collections (also known as tables in classic sql) use `db.createCollection("collectionName", { autoIndexId: true })`. It's not necessary to use auto-indexing but it's for the best since React componets will need an unique identifier for the data.

<b>Do this now! You can change the structure of the collection later, but when the connection is made, the database and the collection has to exist.</b>

So, after you decided upon the structure you want to use for your feature, create some dummy data this way: `db.collectionName.insert({ "key": intValue, "key2: [arr1, arr2], "key3": "sth nice" })`. You can even hold objects inside objects.

To check the status of your entry, `db.collectionName.find().pretty()`. You should see all your records from your collection.

Exit mongo's command line.

### MongoDB Server

Start the mongo server before starting the Node.js server since the second one will try to establish a connection. <b>C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe</b> is the executable. It will tell you somewhere throughout that whole text that it's listening on port <b>27017</b> on <b>localhost</b>. <b>Keep this running while coding!</b>

### Node.js Server

Use `npm install -g pm2` to globally install <b>pm2</b> which starts and watches .js files and automatically restarts them when changes are made.

In the root of the project, run `npm install` to install all the dependencies of the back-end application. You should see newly created folder, <b>node_modules</b> with lots of stuff in it.

Use `pm2 start index.js --watch` to launch the server. To check if everything is ok, `pm2 list` will print a table and a process named <b>index</b> should be <b>online</b> and green.

To debug or see console statements, `pm2 logs index`. Node will output errors and everything you output with `console.log('sth')` in <b>index.js</b>. Check index.js for examples.

While <b>index.js</b> is running in the background, you can keep the logs on to print stuff to check if it's working.

# Development

### index.js file

Here you'll find the root of the application. The connection to the database is already made. Here, you'll create APIs for your feature which the ReactNative app will call to make CRUD operations.

The flow is: get requests from the front-end, query the db or do something else, send a response back.

The operations you can perform are: <b>GET</b> (to fetch chunks of data or single resource), <b>POST</b> (to create new data), <b>PUT</b> (to update a resource), <b>DELETE</b>.

You'll find a POST example for <b>users</b>. You'll have to do the same for your feature. More comments in the code.

Here are some other examples but not applicable for users. <i>boards</i> was my resource name then. You will use something like: `localhost:3000/waterTracker` with the specific HTTP verb.

<b>GET</b> Return a whole array of resources. Callable at `localhost:3000/boards`. This HTTP verbs are set when the request is made in front-end.

```
app.get("/boards", function(req, res) {
db.collection("boards")
.find()
.toArray((err, result) => {
if (err) return console.log(err);

      res.send({
        boards: result
      });
    });

});
```

<b>GET by id</b> Search and return a resource by id. Callable at: `localhost:3000/boards/:id`, where id will most likely be a long unique string.

```
app.get("/boards/:id", function(req, res) {
db.collection("boards")
.find({ _id: req.params.id })
.toArray((err, result) => {
if (err) return console.log(err);

      res.send({
        boards: result
      });
    });

});
```

<b>PUT</b> Needs id to know what to update. Returns the updated object. Callable at: `localhost:3000/boards/:id`.

```
app.put("/boards/:id", function(req, res) {
  db.collection("boards").update(
    { _id: new mongodb.ObjectID(req.params.id) },
    { $set: { board_name: req.body.board_name } },
    function(err, obj) {
      if (err) return console.log(err);

      res.send({
        new_board_name: req.body.board_name
      });
    }
  );
});
```

<b>DELETE</b> Also needs id. Callable at: `localhost:3000/boards/:id`. Return the id of the deleted resource.

```
app.delete("/boards/:id", function(req, res) {
  db.collection("boards").remove(
    { _id: new mongodb.ObjectID(req.params.id) },
    function(err, obj) {
      if (err) return console.log(err);

      console.log(obj.result.n + " record(s) deleted");

      res.send({
        _id: req.params.id
      });
    }
  );
});
```
