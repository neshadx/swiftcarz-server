const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

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

    const db = client.db("swiftcarzDB");
    const carCollection = db.collection("cars");
    const bookingCollection = db.collection("bookings");

    // Create Car
    app.post("/api/cars", async (req, res) => {
      try {
        const car = req.body;
        const result = await carCollection.insertOne(car);
        res.status(201).send(result);
      } catch (err) {
        console.error("POST /api/cars error:", err);
        res.status(500).send({ error: "Failed to add car" });
      }
    });

    // Get All Cars
    app.get("/api/cars", async (req, res) => {
      try {
        const cars = await carCollection.find().toArray();
        res.send(cars);
      } catch (err) {
        console.error("GET /api/cars error:", err);
        res.status(500).send({ error: "Failed to fetch cars" });
      }
    });

    // Get Car by ID
    app.get("/api/cars/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const car = await carCollection.findOne({ _id: new ObjectId(id) });
        if (!car) return res.status(404).send({ error: "Car not found" });
        res.send(car);
      } catch (err) {
        console.error("GET /api/cars/:id error:", err);
        res.status(500).send({ error: "Failed to fetch car" });
      }
    });

    // Update Car
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
        console.error("PUT /api/cars/:id error:", err);
        res.status(500).send({ error: "Failed to update car" });
      }
    });

    // Delete Car
    app.delete("/api/cars/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (err) {
        console.error("DELETE /api/cars/:id error:", err);
        res.status(500).send({ error: "Failed to delete car" });
      }
    });

    // Book a Car
    app.post("/api/bookings", async (req, res) => {
      try {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);

        // Increment bookingCount of car
        await carCollection.updateOne(
          { _id: new ObjectId(booking.carId) },
          { $inc: { bookingCount: 1 } }
        );

        res.status(201).send(result);
      } catch (err) {
        console.error("POST /api/bookings error:", err);
        res.status(500).send({ error: "Failed to book car" });
      }
    });

    // Get My Bookings
    app.get("/api/bookings/my", async (req, res) => {
      try {
        const email = req.query.email;
        if (!email) {
          return res.status(400).send({ error: "Email is required" });
        }

        const bookings = await bookingCollection.find({ userEmail: email }).toArray();
        res.send(bookings);
      } catch (err) {
        console.error("GET /api/bookings/my error:", err);
        res.status(500).send({ error: "Failed to fetch bookings" });
      }
    });

    // Root Test Route
    app.get("/", (req, res) => {
      res.send("🚗 SwiftCarz backend is running!");
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
