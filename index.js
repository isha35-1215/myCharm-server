const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require ('express');
const cors = require('cors');
require('dotenv').config();
const app =express();
const port =process.env.PORT|| 5000;

//middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwlezc0.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.flmhf7e.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    await client.connect();

    const productCollection =client.db('productDB').collection('product')
    const brandCollection =client.db('productDB').collection('brand')
    const cartCollection =client.db('productDB').collection('cart')


    app.get('/brands' , async(req,res) =>{
        const cursor =brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
     app.post('/brands',async(req,res) =>{
        const brandData = req.body;
        console.log(brandData);
        const result = await brandCollection.insertOne(brandData);
        res.send(result);
     })  
    app.get('/products' , async(req,res) =>{
        const products = await productCollection.find().toArray()
        res.send(products);
    })
    app.get('/products/:brand' , async(req,res) =>{
        const brand = req.params.brand;
        const products = await productCollection.find({brand: brand}).toArray();
        res.json(products);
    })
     app.post('products/:brand',async(req,res) =>{
        const allProductData = req.body;
        console.log(allProductData);
        const result = await productCollection.insertOne(allProductData);
        res.send(result);
     })  
     app.post('/products',async(req,res) =>{
        const productData = req.body;
        console.log(productData);
        const result = await productCollection.insertOne(productData);
        res.send(result);
     })  
     app.post('/cart', async(req, res) => {
        const productData = req.body;
        console.log(productData);
        const result = await cartCollection.insertOne(productData);
        res.send(result);
     })
     app.get('/cart' , async(req,res) =>{
        const cursor =cartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.delete('/delete/:id', async(req, res)=>{
        const deleteId = req.params.id;
        const query = {_id : new ObjectId(deleteId)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
        console.log(query)
    })
     app.get('/updateProduct/:id', async ( req, res) => {
        const id = req.params.id;
        const query = { _id : new  ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
     })

    app.put('/updateProduct/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updateProduct = req.body;
        const Product = {
            $set: {
                image: updateProduct.image,
                name: updateProduct.name, 
                brand: updateProduct.brand, 
                type: updateProduct.type, 
                price: updateProduct.price, 
                description: updateProduct.description, 
                rating: updateProduct.rating
            }
        }

        const result = await productCollection.updateOne(filter, Product, options);
        res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',( req,res) => {
res.send('MyCharm server is running')
})
app.listen( port, () => {
    console.log(`MyCharm  is running on port : ${port}`)
})