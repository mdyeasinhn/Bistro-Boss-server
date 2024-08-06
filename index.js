const express = require('express');
const jwt = require('JsonWebTokenError')
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 9000

// bistro-boss_db 
// M7mNvOXLM0pz0vqz
// MIDDLEWARE
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrif73o.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const userCollection = client.db("bistrodb").collection("users")
    const menuCollection = client.db("bistrodb").collection("menu")
    const reviewCollection = client.db("bistrodb").collection("review")
    const cartCollection = client.db("bistrodb").collection("carts")
    // user related api 
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      // insert email if user dosent exiest : 
      // you can do the any ways (1.email unique, 2.upsert, 3. simple checking)
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user allready exiest', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    });


    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
    // menu related api
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result)
    })
    // reviews collection

    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result)
    })
    // carts collection
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result)
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Bistro boss is running')
})

app.listen(port, () => {
  console.log(`Bistro boss is running on port ${port}`);
})