const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 15000;
const app = express();
require('dotenv').config()

// ** Middle Wares 

app.use(cors());
app.use(express.json());

// ** initial server endpoint

app.get('/', (req,res)=> res.send('genius car server is running'));

// ** DB COnnection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7ikallh.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



// ** app listen

app.listen(port,()=> console.log(`genius car server is running on ${port}`))