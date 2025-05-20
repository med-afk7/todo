const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp')

.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Task schema and model
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });

  const newTask = new Task({ text });
  await newTask.save();
  res.status(201).json(newTask);
});

// Update a task (toggle done or update text)
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid task ID' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
