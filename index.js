const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

// IMPORTANT: Define globally
let carCollection, bookingCollection;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Vercel-safe async handler
async function run() {
  try {
    await client.connect();
    const db = client.db("swiftcarzDB");
    carCollection = db.collection("cars");
    bookingCollection = db.collection("bookings");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
}

run().catch(console.dir);

// Routes below remain outside run()

app.get("/", (req, res) => {
  res.send("🚗 SwiftCarz backend is running!");
});

app.post("/api/cars", async (req, res) => {
  try {
    const car = req.body;
    const result = await carCollection.insertOne(car);
    res.status(201).send(result);
  } catch (err) {
    console.error("POST /api/cars error:", err.message);
    res.status(500).send({ error: "Failed to add car" });
  }
});

app.get("/api/cars", async (req, res) => {
  try {
    const cars = await carCollection.find().toArray();
    res.send(cars);
  } catch (err) {
    console.error("GET /api/cars error:", err.message);
    res.status(500).send({ error: "Failed to fetch cars" });
  }
});

app.get("/api/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const car = await carCollection.findOne({ _id: new ObjectId(id) });
    if (!car) return res.status(404).send({ error: "Car not found" });
    res.send(car);
  } catch (err) {
    console.error("GET /api/cars/:id error:", err.message);
    res.status(500).send({ error: "Failed to fetch car" });
  }
});

app.put("/api/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await carCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.send(result);
  } catch (err) {
    console.error("PUT /api/cars/:id error:", err.message);
    res.status(500).send({ error: "Failed to update car" });
  }
});

app.delete("/api/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    console.error("DELETE /api/cars/:id error:", err.message);
    res.status(500).send({ error: "Failed to delete car" });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = req.body;
    const result = await bookingCollection.insertOne(booking);

    await carCollection.updateOne(
      { _id: new ObjectId(booking.carId) },
      { $inc: { bookingCount: 1 } }
    );

    res.status(201).send(result);
  } catch (err) {
    console.error("POST /api/bookings error:", err.message);
    res.status(500).send({ error: "Failed to book car" });
  }
});

app.get("/api/bookings/my", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    const bookings = await bookingCollection.find({ userEmail: email }).toArray();
    res.send(bookings);
  } catch (err) {
    console.error("GET /api/bookings/my error:", err.message);
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
