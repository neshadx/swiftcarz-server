
// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// // ✅ CORS setup
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://swiftcarz-client.vercel.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // ✅ MongoDB setup
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   console.error("❌ MONGODB_URI not set.");
//   process.exit(1);
// }

// let carCollection, bookingCollection;

// const client = new MongoClient(uri, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("swiftcarzDB");
//     carCollection = db.collection("cars");
//     bookingCollection = db.collection("bookings");
//     console.log("✅ MongoDB connected!");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//   }
// }
// run().catch(console.dir);

// // ✅ JWT Middleware — supports cookie and header
// function verifyToken(req, res, next) {
//   const token =
//     req.cookies?.token ||
//     req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     console.log("🔴 No token found");
//     return res.status(401).send({ error: "Unauthorized access" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.log("🔴 Token invalid");
//       return res.status(403).send({ error: "Forbidden" });
//     }
//     req.user = decoded;
//     next();
//   });
// }

// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("🚗 SwiftCarz backend is running!");
// });

// // ✅ Login route — sets cookie & sends token
// app.post("/api/auth/login", (req, res) => {
//   const user = req.body;
//   if (!user?.email) return res.status(400).send({ error: "Invalid payload" });

//   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 2 * 60 * 60 * 1000,
//     })
//     .send({ success: true, token }); // ✅ token returned for frontend
// });

// // ✅ Logout
// app.post("/api/auth/logout", (req, res) => {
//   res
//     .clearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .send({ success: true });
// });

// // ✅ Add Car (Protected)
// app.post("/api/cars", verifyToken, async (req, res) => {
//   try {
//     const car = {
//       ...req.body,
//       createdAt: new Date(),
//       bookingCount: 0,
//     };
//     const result = await carCollection.insertOne(car);
//     res.status(201).send(result);
//   } catch (err) {
//     console.error("❌ Add Car Error:", err.message);
//     res.status(500).send({ error: "Failed to add car" });
//   }
// });

// // ✅ Get All Cars (Public)
// app.get("/api/cars", async (req, res) => {
//   try {
//     const cars = await carCollection.find().toArray();
//     res.send(cars);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch cars" });
//   }
// });

// // ✅ Get Car by ID
// app.get("/api/cars/:id", async (req, res) => {
//   try {
//     const car = await carCollection.findOne({ _id: new ObjectId(req.params.id) });
//     if (!car) return res.status(404).send({ error: "Car not found" });
//     res.send(car);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch car" });
//   }
// });

// // ✅ Update Car
// app.put("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: req.body }
//     );
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update car" });
//   }
// });

// // ✅ Delete Car
// app.delete("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to delete car" });
//   }
// });

// // ✅ Book a Car
// app.post("/api/bookings", verifyToken, async (req, res) => {
//   try {
//     const booking = req.body;
//     const result = await bookingCollection.insertOne(booking);
//     await carCollection.updateOne(
//       { _id: new ObjectId(booking.carId) },
//       { $inc: { bookingCount: 1 } }
//     );
//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to book car" });
//   }
// });

// // ✅ Get My Bookings
// app.get("/api/bookings/my", verifyToken, async (req, res) => {
//   try {
//     const email = req.query.email;
//     if (!email || req.user.email !== email) {
//       return res.status(403).send({ error: "Forbidden" });
//     }
//     const bookings = await bookingCollection.find({ userEmail: email }).toArray();
//     res.send(bookings);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch bookings" });
//   }
// });

// // ✅ Start server
// app.listen(port, () => {
//   console.log(`🚀 SwiftCarz server running on port ${port}`);
// });


// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// // ✅ CORS setup
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://swiftcarz-client.vercel.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // ✅ MongoDB setup
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   console.error("❌ MONGODB_URI not set.");
//   process.exit(1);
// }

// let carCollection, bookingCollection;

// const client = new MongoClient(uri, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("swiftcarzDB");
//     carCollection = db.collection("cars");
//     bookingCollection = db.collection("bookings");
//     console.log("✅ MongoDB connected!");
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err.message);
//   }
// }
// run().catch(console.dir);

// // ✅ JWT Middleware
// function verifyToken(req, res, next) {
//   const token =
//     req.cookies?.token || req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).send({ error: "Unauthorized access" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).send({ error: "Forbidden" });
//     req.user = decoded;
//     next();
//   });
// }

// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("🚗 SwiftCarz backend is running!");
// });

// // ✅ Login
// app.post("/api/auth/login", (req, res) => {
//   const user = req.body;
//   if (!user?.email) return res.status(400).send({ error: "Invalid payload" });

//   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 2 * 60 * 60 * 1000,
//     })
//     .send({ success: true, token });
// });

// // ✅ Logout
// app.post("/api/auth/logout", (req, res) => {
//   res
//     .clearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .send({ success: true });
// });

// // ✅ Add Car (Protected)
// app.post("/api/cars", verifyToken, async (req, res) => {
//   try {
//     const car = {
//       ...req.body,
//       createdAt: new Date(),
//       bookingCount: 0,
//     };
//     const result = await carCollection.insertOne(car);
//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to add car" });
//   }
// });

// // ✅ Get All Cars
// app.get("/api/cars", async (req, res) => {
//   try {
//     const cars = await carCollection.find().toArray();
//     res.send(cars);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch cars" });
//   }
// });

// // ✅ Get Car by ID
// app.get("/api/cars/:id", async (req, res) => {
//   try {
//     const car = await carCollection.findOne({ _id: new ObjectId(req.params.id) });
//     if (!car) return res.status(404).send({ error: "Car not found" });
//     res.send(car);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch car" });
//   }
// });

// // ✅ Update Car
// app.put("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: req.body }
//     );
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update car" });
//   }
// });

// // ✅ Delete Car
// app.delete("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to delete car" });
//   }
// });

// // ✅ Book a Car
// app.post("/api/bookings", verifyToken, async (req, res) => {
//   try {
//     const booking = req.body;
//     const result = await bookingCollection.insertOne(booking);

//     await carCollection.updateOne(
//       { _id: new ObjectId(booking.carId) },
//       { $inc: { bookingCount: 1 } }
//     );

//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to book car" });
//   }
// });

// // ✅ Get My Bookings
// app.get("/api/bookings/my", verifyToken, async (req, res) => {
//   try {
//     const email = req.query.email;
//     if (!email || req.user.email !== email) {
//       return res.status(403).send({ error: "Forbidden" });
//     }

//     const bookings = await bookingCollection.find({ userEmail: email }).toArray();
//     res.send(bookings);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch bookings" });
//   }
// });

// // ✅ Update Booking (PUT)
// app.put("/api/bookings/:id", verifyToken, async (req, res) => {
//   const bookingId = req.params.id;

//   if (!ObjectId.isValid(bookingId)) {
//     return res.status(400).send({ error: "Invalid booking ID format" });
//   }

//   try {
//     const updateData = req.body;

//     const result = await bookingCollection.updateOne(
//       { _id: new ObjectId(bookingId) },
//       { $set: updateData }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).send({ error: "Booking not found or unchanged" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     console.error("❌ Update Booking Error:", err.message);
//     res.status(500).send({ error: "Failed to update booking" });
//   }
// });

// // ✅ Cancel Booking (DELETE)
// app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
//   const bookingId = req.params.id;

//   if (!ObjectId.isValid(bookingId)) {
//     return res.status(400).send({ error: "Invalid booking ID format" });
//   }

//   try {
//     const result = await bookingCollection.deleteOne({
//       _id: new ObjectId(bookingId),
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).send({ error: "Booking not found" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     console.error("❌ Cancel Booking Error:", err.message);
//     res.status(500).send({ error: "Failed to cancel booking" });
//   }
// });

// //  Start server
// app.listen(port, () => {
//   console.log(`🚀 SwiftCarz server running on port ${port}`);
// });


// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// //  CORS setup
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://swiftcarz-client.vercel.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// //  MongoDB setup
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   console.error("MONGODB_URI not set.");
//   process.exit(1);
// }

// let carCollection, bookingCollection;

// const client = new MongoClient(uri, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("swiftcarzDB");
//     carCollection = db.collection("cars");
//     bookingCollection = db.collection("bookings");
//     console.log("MongoDB connected!");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//   }
// }
// run().catch(console.dir);

// //  JWT Middleware
// function verifyToken(req, res, next) {
//   const token =
//     req.cookies?.token || req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).send({ error: "Unauthorized access" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).send({ error: "Forbidden" });
//     req.user = decoded;
//     next();
//   });
// }

// //  Health check
// app.get("/", (req, res) => {
//   res.send("🚗 SwiftCarz backend is running!");
// });

// //  Login
// app.post("/api/auth/login", (req, res) => {
//   const user = req.body;
//   if (!user?.email) return res.status(400).send({ error: "Invalid payload" });

//   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 2 * 60 * 60 * 1000,
//     })
//     .send({ success: true, token });
// });

// //  Logout
// app.post("/api/auth/logout", (req, res) => {
//   res
//     .clearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .send({ success: true });
// });

// //  Add Car
// app.post("/api/cars", verifyToken, async (req, res) => {
//   try {
//     const car = {
//       ...req.body,
//       createdAt: new Date(),
//       bookingCount: 0,
//     };
//     const result = await carCollection.insertOne(car);
//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to add car" });
//   }
// });

// //  Get All Cars
// app.get("/api/cars", async (req, res) => {
//   try {
//     const cars = await carCollection.find().toArray();
//     res.send(cars);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch cars" });
//   }
// });

// //  Get Car by ID
// app.get("/api/cars/:id", async (req, res) => {
//   try {
//     const car = await carCollection.findOne({ _id: new ObjectId(req.params.id) });
//     if (!car) return res.status(404).send({ error: "Car not found" });
//     res.send(car);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch car" });
//   }
// });

// //  Update Car
// app.put("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: req.body }
//     );
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update car" });
//   }
// });

// //  Delete Car
// app.delete("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to delete car" });
//   }
// });

// //  Book a Car
// app.post("/api/bookings", verifyToken, async (req, res) => {
//   try {
//     const booking = req.body;
//     const result = await bookingCollection.insertOne(booking);

//     await carCollection.updateOne(
//       { _id: new ObjectId(booking.carId) },
//       { $inc: { bookingCount: 1 } }
//     );

//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to book car" });
//   }
// });

// //  Get My Bookings
// app.get("/api/bookings/my", verifyToken, async (req, res) => {
//   try {
//     const email = req.query.email;
//     if (!email || req.user.email !== email) {
//       return res.status(403).send({ error: "Forbidden" });
//     }

//     const bookings = await bookingCollection.find({ userEmail: email }).toArray();
//     res.send(bookings);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch bookings" });
//   }
// });

// //  Update Booking
// app.put("/api/bookings/:id", verifyToken, async (req, res) => {
//   const id = req.params.id;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ error: "Invalid booking ID" });
//   }

//   try {
//     const result = await bookingCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: req.body }
//     );
// // console.log(result)
//     if (result.modifiedCount === 0) {
//       return res.status(404).send({ error: "Booking not found or unchanged" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update booking" });
//   }
// });

// // Cancel Booking
// app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
//   const id = req.params.id;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ error: "Invalid booking ID" });
//   }

//   try {
//     const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).send({ error: "Booking not found" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to cancel booking" });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`SwiftCarz server running on port ${port}`);
// });





// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 5000;

// //  CORS setup
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://swiftcarz-client.vercel.app"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// //  MongoDB setup
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   console.error("MONGODB_URI not set.");
//   process.exit(1);
// }

// let carCollection, bookingCollection;

// const client = new MongoClient(uri, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
// });

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("swiftcarzDB");
//     carCollection = db.collection("cars");
//     bookingCollection = db.collection("bookings");
//     console.log("MongoDB connected!");
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//   }
// }
// run().catch(console.dir);

// //  JWT Middleware
// function verifyToken(req, res, next) {
//   const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).send({ error: "Unauthorized access" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).send({ error: "Forbidden" });
//     req.user = decoded;
//     next();
//   });
// }

// //  Health check
// app.get("/", (req, res) => {
//   res.send("🚗 SwiftCarz backend is running!");
// });

// //  Login
// app.post("/api/auth/login", (req, res) => {
//   const user = req.body;
//   if (!user?.email) return res.status(400).send({ error: "Invalid payload" });

//   const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 2 * 60 * 60 * 1000,
//     })
//     .send({ success: true, token });
// });

// //  Logout
// app.post("/api/auth/logout", (req, res) => {
//   res
//     .clearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//     })
//     .send({ success: true });
// });

// //  Add Car
// app.post("/api/cars", verifyToken, async (req, res) => {
//   try {
//     const car = {
//       ...req.body,
//       createdAt: new Date(),
//       bookingCount: 0,
//     };
//     const result = await carCollection.insertOne(car);
//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to add car" });
//   }
// });

// //  Get All Cars
// app.get("/api/cars", async (req, res) => {
//   try {
//     const cars = await carCollection.find().toArray();
//     res.send(cars);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch cars" });
//   }
// });

// //  Get Car by ID
// app.get("/api/cars/:id", async (req, res) => {
//   try {
//     const car = await carCollection.findOne({ _id: new ObjectId(req.params.id) });
//     if (!car) return res.status(404).send({ error: "Car not found" });
//     res.send(car);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch car" });
//   }
// });

// //  Update Car
// app.put("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: req.body }
//     );
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update car" });
//   }
// });

// //  Delete Car
// app.delete("/api/cars/:id", verifyToken, async (req, res) => {
//   try {
//     const result = await carCollection.deleteOne({ _id: new ObjectId(req.params.id) });
//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to delete car" });
//   }
// });

// //  Book a Car
// app.post("/api/bookings", verifyToken, async (req, res) => {
//   try {
//     const booking = req.body;
//     const result = await bookingCollection.insertOne(booking);

//     await carCollection.updateOne(
//       { _id: new ObjectId(booking.carId) },
//       { $inc: { bookingCount: 1 } }
//     );

//     res.status(201).send(result);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to book car" });
//   }
// });

// //  Get My Bookings (with car info)
// app.get("/api/bookings/my", verifyToken, async (req, res) => {
//   try {
//     const email = req.query.email;
//     if (!email || req.user.email !== email) {
//       return res.status(403).send({ error: "Forbidden" });
//     }

//     const bookings = await bookingCollection.find({ userEmail: email }).toArray();
//     const carIds = bookings.map((b) => new ObjectId(b.carId));
//     const cars = await carCollection.find({ _id: { $in: carIds } }).toArray();

//     const enriched = bookings.map((booking) => {
//       const car = cars.find((c) => c._id.toString() === booking.carId);
//       return { ...booking, car };
//     });

//     res.send(enriched);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch bookings" });
//   }
// });

// //  Update Booking
// app.put("/api/bookings/:id", verifyToken, async (req, res) => {
//   const id = req.params.id;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ error: "Invalid booking ID" });
//   }

//   try {
//     const result = await bookingCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: req.body }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).send({ error: "Booking not found or unchanged" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update booking" });
//   }
// });

// // Cancel Booking
// app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
//   const id = req.params.id;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ error: "Invalid booking ID" });
//   }

//   try {
//     const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).send({ error: "Booking not found" });
//     }

//     res.send({ success: true });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to cancel booking" });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`SwiftCarz server running on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// CORS setup
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://zesty-melomakarona-8c8976.netlify.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://musical-gecko-f6cbb2.netlify.app", "https://swift-carz.netlify.app", "https://zesty-melomakarona-8c8976.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// MongoDB setup
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not set.");
  process.exit(1);
}

let carCollection, bookingCollection;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("swiftcarzDB");
    carCollection = db.collection("cars");
    bookingCollection = db.collection("bookings");
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}
run().catch(console.dir);

// JWT Middleware
function verifyToken(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Unauthorized access" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ error: "Forbidden" });
    req.user = decoded;
    next();
  });
}

// Health check
app.get("/", (req, res) => {
  res.send("🚗 SwiftCarz backend is running!");
});

// FIXED: Login route (only email signed)
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ error: "Email is required" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2 * 60 * 60 * 1000,
    })
    .send({ success: true });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    })
    .send({ success: true });
});

// Add Car
app.post("/api/cars", verifyToken, async (req, res) => {
  try {
    const car = {
      ...req.body,
      createdAt: new Date(),
      bookingCount: 0,
    };
    const result = await carCollection.insertOne(car);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to add car" });
  }
});

// Get All Cars
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await carCollection.find().toArray();
    res.send(cars);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch cars" });
  }
});

// Get Car by ID
app.get("/api/cars/:id", async (req, res) => {
  try {
    const car = await carCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!car) return res.status(404).send({ error: "Car not found" });
    res.send(car);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch car" });
  }
});

// Update Car
app.put("/api/cars/:id", verifyToken, async (req, res) => {
  try {
    const result = await carCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to update car" });
  }
});

// Delete Car
app.delete("/api/cars/:id", verifyToken, async (req, res) => {
  try {
    const carId = req.params.id;
    await bookingCollection.deleteMany({ carId });
    const result = await carCollection.deleteOne({ _id: new ObjectId(carId) });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to delete car and bookings" });
  }
});

// Book a Car
app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const booking = {
      ...req.body,
      createdAt: new Date(),
    };
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

//  Get My Bookings (with car info)
app.get("/api/bookings/my", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;
    if (!email || req.user.email !== email) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const bookings = await bookingCollection.find({ userEmail: email }).toArray();
    const carIds = bookings.map((b) => new ObjectId(b.carId));
    const cars = await carCollection.find({ _id: { $in: carIds } }).toArray();

    const enriched = bookings.map((booking) => {
      const car = cars.find((c) => c._id.toString() === booking.carId);
      return { ...booking, car };
    });

    res.send(enriched);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

// Update Booking
app.put("/api/bookings/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid booking ID" });
  }

  try {
    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ error: "Booking not found or unchanged" });
    }

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to update booking" });
  }
});

// Cancel Booking
app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid booking ID" });
  }

  try {
    const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Booking not found" });
    }

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: "Failed to cancel booking" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 SwiftCarz server running on port ${port}`);
});
