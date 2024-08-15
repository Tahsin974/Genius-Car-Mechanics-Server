const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors())
app.use(express.json())
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${username}:${password}@cluster0.3lwmdbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanicDB");
    const servicesCollection = database.collection("services");
    const trainerCollection = database.collection("trainers");

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service)
      res.json(result)
    });

    // GET API 
    app.get("/services", async (req,res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray()
        res.send(services);

    })
    // GET API 
    app.get("/trainers", async (req,res) => {
        const cursor = trainerCollection.find({});
        const trainers = await cursor.toArray()
        res.send(trainers);

    })
    // GET API 
    app.get("/services/:id" , async(req,res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service)

    })
    // DELETE API 
    app.delete("/services/:id" , async(req,res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const service = await servicesCollection.deleteOne(query);
        res.send(service)
    })
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome To Genius Car Server");
});

app.listen(port, () => {
  console.log("Running Genius Car Mechanics Server Port:", port);
});
