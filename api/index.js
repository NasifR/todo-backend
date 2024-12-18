const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Schema & Model
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", TaskSchema);

// Routes
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.json(savedTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted successfully" });
});

module.exports = app;
