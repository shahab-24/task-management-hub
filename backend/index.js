require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const jwt = require("jsonwebtoken"); // Import JWT
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", 'http://localhost:5174'], // Ensure this matches your frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


 // Verify JWT Token Middleware
//  const verifyToken = async (req, res, next) => {
//         const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
//         if (!token) return res.status(401).send({ message: "Unauthorized access" });
  
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//           if (err) return res.status(401).send({ message: "Unauthorized access" });
//           req.user = decoded;
//           next();
//         });
//       };
// const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
        console.log("✅ All Received Cookies:", req.cookies); // Debug: Check all cookies
        const token = req.cookies?.token; // Get token from cookies
        console.log("✅ Extracted Token:", token); // Debug: Log extracted token
    
        if (!token) return res.status(401).send({ message: "Unauthorized access, token missing" });
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log("❌ Token verification failed:", err.message);
                return res.status(401).send({ message: "Unauthorized access, invalid token" });
            }
            req.user = decoded;
            next();
        });
    };
    
      
    
  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jtn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
//     await client.connect();
//     console.log("Connected to MongoDB");

    const tasksCollection = client.db("taskDB").collection("tasks");
    const usersCollection = client.db("taskDB").collection("users");
    const activityCollection = client.db("taskDB").collection("activity");

   
    // User Creation API
//     app.get('/tasks/users/:email', verifyToken, async (req, res) => {
//         const email = req.params.email;
//         const query = { email };
      
//         try {
//           const result = await usersCollection.find(query).toArray()
      
//           if (!result) {
//             return res.status(404).send({ message: "User not found" });
//           }
      
//           res.status(200).send(result);
//         } catch (error) {
//           res.status(500).send({ message: "Error fetching user", error: error.message });
//         }
//       });
      


  // POST Route for creating a user (without email in URL)
  app.post('/tasks/users', verifyToken, async (req, res) => {
        const { name, email, image } = req.body;
        // console.log("Request Body:", req.body); // Log to see the incoming data
      
        try {
          const existingUser = await usersCollection.findOne({ email });
          if (existingUser) {
                await usersCollection.updateOne(
                  { email },
                  { $set: { name, image } }
                );
                return res.status(200).send({ message: "User updated" });
              }
      
          const newUser = { name, email, image };
          await usersCollection.insertOne(newUser);
          res.status(201).send(newUser);
        } catch (error) {
          res.status(500).send({ message: "Error creating user", error: error.message });
        }
      });
      
      

    // Get Tasks API
    app.get('/tasks', verifyToken, async (req, res) => {
        console.log("Decoded User:", req.user); // ✅ Debugging JWT token extraction
        const userEmail = req.user?.email; 
    
        if (!userEmail) {
            return res.status(401).send({ message: "Unauthorized access" });
        }
    
        try {
            const tasks = await tasksCollection.find({ email: userEmail }).toArray();
            console.log("Fetched tasks from DB:", tasks); // ✅ Check if tasks exist in DB
            res.status(200).send(tasks);
        } catch (error) {
            res.status(500).send({ message: "Failed to get tasks", error: error.message });
        }
    });
    
    
      

    

app.post('/tasks', verifyToken, async (req, res) => {
        let { title, description, category, dueDate, email } = req.body;
    
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
    
        const newTask = { 
            title, 
            description, 
            category, 
            dueDate, 
            email, 
            timestamp: new Date() 
        };
    
        try {
            const result = await tasksCollection.insertOne(newTask);
            console.log("✅ Task Inserted Correctly:", result);
            res.status(201).send(result);
        } catch (error) {
            console.error("❌ Error inserting task:", error);
            res.status(500).send({ message: "Failed to create task", error: error.message });
        }
    });
    
    

    // Reorder Tasks API
  
    app.put("/tasks/reorder", async (req, res) => {
        const { taskId, newCategory, newIndex } = req.body;
    
        // Validate the request body
        if (!taskId || !newCategory || newIndex === undefined) {
            return res.status(400).json({ message: "Invalid task data" });
        }
    
        // Validate ObjectId format
        if (!ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid taskId format" });
        }
    
        try {
            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: { category: newCategory, order: newIndex } }
            );
    
            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: "No changes made" });
            }
    
            res.json({ message: "Reorder successful" });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ message: "Failed to update order", error: error.message });
        }
    });
    
    

    // Delete Task API
    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id; // Fix extracting ID
        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete task" });
      }
    });

    // Get Activity API
    app.get("/tasks/activity", async (req, res) => {
      try {
        const result = await activityCollection.find().sort({ timestamp: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get activity" });
      }
    });

    // Create Activity API
    app.post("/tasks/activity", async (req, res) => {
      try {
        const activity = { ...req.body, timestamp: new Date() };
        const result = await activityCollection.insertOne(activity);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to create activity" });
      }
    });

    // JWT Authentication
    app.post("/tasks/jwt", async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).send({ message: "Email is required" });
    
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false, // Use false for localhost
            sameSite: "lax", // ✅ Change from "strict" to "lax" to allow cross-site cookies
        }).send({ success: true });
    });
    

// app.post("/tasks/jwt", async (req, res) => {
//         const { email } = req.body;
//         if (!email) return res.status(400).send({ message: "Email is required" });
    
//         const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    
//         res.cookie("token", token, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//                 maxAge: 3600000,
//             }).send({ message: "Token set" });
//     });
    

    // Logout API
    app.get("/tasks/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
      } catch (error) {
        res.status(500).send({ message: "Failed to logout" });
      }
    });

  } finally {
  }
}
run().catch(console.dir);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  console.log("Task server is running");
  res.send("Task server is running");
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
