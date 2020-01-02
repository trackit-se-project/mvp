# Installation

### cmder

If you find it easier to work with a linux style type terminal since cmd or powershell are dummy, try [cmder](https://cmder.net/). It's an console emulator for Windows and it can have multiple tabs open which will be useful for later. It's all extract & run. Get the full version if you want to use it.

### MongoDB

Download [MongoDB](https://www.mongodb.com/download-center/enterprise) from here and select your OS. Get the `current release version` (most likely 4.2.2).

### Node.js

Download [Node.js](https://nodejs.org/en/download/) from here. Take the `LTS` version.

### ReactNative

Fill this in later.

# Setup

### MongoDB

If you're on Windows, on your C: drive, create a folder <b>data</b> with a folder <b>db</b> inside of it. The <b>data</b> folder should be exactly on the root of the C: drive along Program Files, Users, Windows etc.
<br />
This [tutorial](https://www.tutorialspoint.com/mongodb/index.htm) contains pretty much all the necessary commands for mongo.
<br />
To enter the command line of mongo and create a new database, on Windows, if you chose the default installation path, go to <b>C:\Program Files\MongoDB\Server\4.2\bin</b> and run <b>mongo.exe</b>.
<br />
`use mvp` will create the <b>mvp</b> database and select it. <b>USE THIS NAME FOR THE DATABASE!</b>
<br />
`db` command should output <b>mvp</b>
<br />
To create collections (also known as tables in classic sql) use `db.createCollection("collectionName", { autoIndexId: true })`. It's not necessary to use auto-indexing but it's for the best since React componets will need an unique identifier for the data. So, after you decided upon the structure you want to use for your feature, create some dummy data this way: `db.collectionName.insert({ "key": intValue, "key2: [arr1, arr2], "key3": "sth nice" })`. You can even hold objects inside objects.

### MongoDB Server

When your app is running, you'll have to keep the mongo server active in a terminal screen. <b>C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe</b> is the executable. It will tell you somewhere throughout that whole text that it's listening on port <b>27017</b> on <b>localhost</b>. <b>Keep this running while coding!</b>

### Node.js Server

Use `npm install -g pm2` to globally install <b>pm2</b> which starts and watches .js files and automatically restarts them when changes are made.
<br />
In the root of the project, run `npm install` to install all the dependencies of the back-end application.
<br />
Use `pm2 start index.js --watch` to launch the server. To check if everything is ok, `pm2 list` will print a table and a process named <b>index</b> should be <b>online</b> and green.
<br />
To debug or see console statements, `pm2 logs index`. Node will output errors and everything you output with `console.log('sth')` in <b>index.js</b>. Check file for examples.
