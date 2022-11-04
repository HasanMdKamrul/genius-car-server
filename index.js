const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 15000;
const app = express();
// ** JWT
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ** Middle Wares

app.use(cors());
app.use(express.json());

// ** initial server endpoint

app.get("/", (req, res) => res.send("genius car server is running"));

// ** Verify JWT

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ message: "unauthorised access" });
  }

  // ** verify token

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "unauthorised access" });
    }

    req.decoded = decoded;

    next();
  });
};

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
    const orderCollection = client.db("geniusCar").collection("orders");

    // ** jwt token generation
    // ** step 1 first getting the payload data from client

    app.post("/jwt", (req, res) => {
      const user = req.body;

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      res.send({ token });
    });

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

    // ** get orders data from the db using the email query parameter

    app.get("/orders", verifyJwt, async (req, res) => {
      console.log(req.decoded);

      let query = {};

      if (req.decoded.email !== req.query.email) {
        return res.status(403).send({ message: "unauthorised access" });
      }

      console.log(req.query.email);

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const cursor = orderCollection.find(query);
      const order = await cursor.toArray();

      res.send(order);
    });

    // ** send data (order data)

    app.post("/orders", verifyJwt, async (req, res) => {
      const orderData = req.body;

      const order = await orderCollection.insertOne(orderData);

      res.send(order);
    });

    // ** orders update

    app.patch("/orders/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = {
        _id: ObjectId(id),
      };

      const updatedDoc = {
        $set: {
          status: status,
        },
      };

      const result = await orderCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // ** orders delete

    app.delete("/orders/:id", verifyJwt, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.error(err));

// ** app listen

app.listen(port, () => console.log(`genius car server is running on ${port}`));
