require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");
const app = express();

const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

//middleware
app.use(express.static("public"));

app.use(express.json());

app.use((req,res,next) => {
  if(collection !== null){
    next()
  }else{
    res.status(503).send()
  }
});

//connecting to mongodb
const dbName = "sample_airbnb";
const collectionName = "listingsAndReviews"

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let collection = null;

client.connect()
  .then(() => {
    return client.db(dbName).collection(collectionName);
  })
  .then(__collection => {
    collection = __collection
    return collection.find({}).toArray()
  })
  .then(console.log)

//get requests
app.get("/", (request, response) => {
  if(collection !== null){
    collection.find({}).toArray().then(result => response.json(result))
  }
});

app.get("/dreams", (request, response) => {
  response.json(dreams);
});

//listener
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
