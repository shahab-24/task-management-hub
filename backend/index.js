require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const {
  MongoClient,
  ServerApiVersion,
  Timestamp,
  ObjectId,
} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jtn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const tasksCollection = client.db("taskDB").collection("tasks");
    const usersCollection = client.db("userDB").collection("users");

    app.post("/users", async (req, res) => {
      const { uid, name, email, profilePicture } = req.body;

      try {
        const user = await usersCollection.findOne({ uid });

        if (!user) {
          user = { uid, name, email, profilePicture };
          const result = await usersCollection.insertOne(user);

          res.send(result);
        }
      } catch (error) {
        res.status(500).send({ message: "failed to create user" });
      }
    });

    // task get api
    app.get("/tasks", async (req, res) => {
      try {
        const result = await tasksCollection.find().toArray();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ message: "failed to get tasks" });
      }
    });

    // tasks created api
    app.post("/tasks", async (req, res) => {
      try {
        const tasks = {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category || "To-Do",
          Timestamp: new Date(),
        };
        const result = await tasksCollection.insertOne(tasks);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ message: "failed to create tasks" });
      }
    });


    app.put("/tasks/reorder", async(req,res) => {
        const {updatedTasks} = req.body;

        try {
                await Promise.all(updatedTasks.map((task) => tasksCollection.updateOne({_id: new ObjectId(task._id)}, {$set: {category: task.category, order: task.order}})))
                res.send({message: 'reordered successfull'})
                
        } catch (error) {
                res.send({message: "failed to update"})
                
        }
    })

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params;
        const result = await tasksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "failed to delete task" });
      }
    });
  } finally {
  }
}
run().catch(console.dir);

// const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// let db, tasksCollection;

// async function connectDB() {
//   try {
//     await client.connect();
//     db = client.db("taskDB"); // Change "taskDB" to your actual database name
//     tasksCollection = db.collection("tasks");
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// }
// connectDB();

// // CRUD Routes
// app.post("/tasks", async (req, res) => {
//   try {
//     const task = {
//       title: req.body.title,
//       description: req.body.description,
//       category: req.body.category || "To-Do",
//       timestamp: new Date(),
//     };
//     const result = await tasksCollection.insertOne(task);
//     res.status(201).json(result.ops[0]);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create task" });
//   }
// });

// app.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await tasksCollection.find().toArray();
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve tasks" });
//   }
// });

// app.put("/tasks/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedTask = await tasksCollection.findOneAndUpdate(
//       { _id: new ObjectId(id) },
//       { $set: req.body },
//       { returnDocument: "after" }
//     );
//     res.json(updatedTask.value);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update task" });
//   }
// });

// app.delete("/tasks/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await tasksCollection.deleteOne({ _id: new ObjectId(id) });
//     res.json({ message: "Task deleted" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete task" });
//   }
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  console.log("task server is running");
  res.send("task server is running");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
