const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://swiftcarz-client.vercel.app"
];

// ✅ Middleware setup
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGODB_URI;
let carCollection, bookingCollection;

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
    carCollection = db.collection("cars");
    bookingCollection = db.collection("bookings");
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
}
run().catch(console.dir);

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ error: "Unauthorized access" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ error: "Forbidden" });
    req.user = decoded;
    next();
  });
}

// 🔹 Root
app.get("/", (req, res) => {
  res.send("🚗 SwiftCarz backend is running!");
});

// 🔐 Login
app.post("/api/auth/login", (req, res) => {
  const user = req.body;
  if (!user?.email) return res.status(400).send({ error: "Invalid payload" });

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000,
    })
    .send({ success: true });
});

// 🔓 Logout
app.post("/api/auth/logout", (req, res) => {
  res
    .clearCookie("token", {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    })
    .send({ success: true });
});

// 🚗 Add New Car (Fixed with createdAt & bookingCount)
app.post("/api/cars", verifyToken, async (req, res) => {
  try {
    const car = {
      ...req.body,
      createdAt: new Date(),      // ✅ Added timestamp
      bookingCount: 0             // ✅ Default booking count
    };
    const result = await carCollection.insertOne(car);
    res.status(201).send(result);
  } catch (err) {
    console.error("POST /api/cars error:", err.message);
    res.status(500).send({ error: "Failed to add car" });
  }
});

// 🚗 Get All Cars
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await carCollection.find().toArray();
    res.send(cars);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch cars" });
  }
});

// 🚗 Get Car by ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const car = await carCollection.findOne({ _id: new ObjectId(id) });
    if (!car) return res.status(404).send({ error: "Car not found" });
    res.send(car);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch car" });
  }
});

// 🚗 Update Car
app.put("/api/cars/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const result = await carCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to update car" });
  }
});

// 🚗 Delete Car
app.delete("/api/cars/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await carCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to delete car" });
  }
});

// 📅 Book a Car
app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const booking = req.body;
    const result = await bookingCollection.insertOne(booking);

    await carCollection.updateOne(
      { _id: new ObjectId(booking.carId) },
      { $inc: { bookingCount: 1 } }
    );

    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to book car" });
  }
});

// 📅 Get My Bookings
app.get("/api/bookings/my", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;
    if (!email || req.user.email !== email) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const bookings = await bookingCollection.find({ userEmail: email }).toArray();
    res.send(bookings);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

// 🟢 Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
