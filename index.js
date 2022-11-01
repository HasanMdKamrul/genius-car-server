const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 15000;
const app = express();

// ** Middle Wares 

app.use(cors());
app.use(express.json());

// ** initial server endpoint

app.get('/', (req,res)=> res.send('genius car server is running'))


// ** app listen

app.listen(port,()=> console.log(`genius car server is running on ${port}`))