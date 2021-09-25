require("dotenv").config();
const mongodb = require("mongodb");
const crypto = require("crypto");
const cookie = require("cookie-session");
const express = require("express");
const { response } = require("express");
const app = express();

const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];


//middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.use((req,res,next) => {
  if(users !== null){
    next();
  }else{
    res.status(503).send();
  }
});

app.use(express.urlencoded({extended: true}));
app.use(cookie({
  name: "session",
  keys: [crypto.randomBytes(20).toString("hex"), crypto.randomBytes(20).toString("hex")]
}))


//connect to mongodb
const dbName = "test";

const uri = `mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.HOST}`;
const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let users = null;
let userData = null;

client.connect()
  .then(() => {
    return [client.db(dbName).collection("users"),
            client.db(dbName).collection("user_data")];
  })
  .then(__collection => {
    users = __collection[0]
    userData = __collection[1]
  })


//get requests
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/dreams", (request, response) => {
  response.json(dreams);
});

app.get("/main.html", (req, res) => {
  res.sendFile(__dirname + "/views/main.html");
})


//post requests
app.post("/login", (req,res) => {
  username = req.body.username;
  password = req.body.password;
  
  users.find({
    username,
    password
  })
  .toArray()
  .then((data) => {
    if(data.length === 1){//login success
      res.cookie("user", username + " " + password)
         .redirect("main.html");
    }else{
      res.redirect("/");
    }
  })
})

app.post("/user-orders", (req,res) => {
  console.log(req.body);
  userData.find(req.body).toArray()
  .then((data) => {
    console.log(data[0].orders);
    res.json(data[0].orders);
  })
})


//listener
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


