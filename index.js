const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 15000;
const app = express();
require("dotenv").config();

// ** Middle Wares

app.use(cors());
app.use(express.json());

// ** initial server endpoint

app.get("/", (req, res) => res.send("genius car server is running"));

// ** DB COnnection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7ikallh.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const serviceCollection = client.db("geniusCar").collection("services");

    // ** get all the data from the db
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const servicesData = await cursor.toArray();
      res.send(servicesData);
    });

    // ** get the single data accordin to id

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const service = await serviceCollection.findOne(query);

      res.send(service);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

// ** app listen

app.listen(port, () => console.log(`genius car server is running on ${port}`));
