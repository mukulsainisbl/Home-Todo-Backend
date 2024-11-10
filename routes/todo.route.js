const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const todoModel = require("../models/todo.model");
const accessMiddleware = require("../middleware/accessMiddleware");
const todoRouter = express.Router();
const userModel = require('../models/user.model')

todoRouter.get("/", async (req, res) => {
  try {
    // Retrieve all to-do items from the database
    const allTodos = await todoModel.find();

    // If no to-do items found
    if (!allTodos.length) {
      return res.status(404).json({ message: "No to-do items found" });
    }

    // Respond with the list of to-do items
    res.status(200).json({ message: "All to-do items", todos: allTodos });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve to-do items" });
  }
});


todoRouter.post("/create-todo", authMiddleware, async (req, res) => {
  try {
  
    const { title, description } = req.body;
    // Create a new to-do item with userId


    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newTodo = new  todoModel({
      title,
      description,
      userId : req.userId,
      userName:user.firstName
      

    });

    // Save the to-do item to the database
    await newTodo.save();

    // Respond with success message and created to-do item
    res
      .status(201)
      .json({ message: "To-do created successfully", newTodo});
  } catch (error) {
    res.status(500).json({ error });
  }
});

todoRouter.put("/update/:todoId", async (req, res) => {
  try {
    const { todoId } = req.params;
    const updates = req.body; // Get all fields to update from req.body

    // Find the to-do item by ID and update it
    const updatedTodo = await todoModel.findByIdAndUpdate(
      todoId,
      updates, // Apply all changes from req.body
      { new: true } // Return the updated document
    );

    // If no to-do item is found with the given ID
    if (!updatedTodo) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    // Respond with the updated to-do item
    res
      .status(200)
      .json({ message: "To-do updated successfully", todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ error: "Failed to update to-do" });
  }
});

todoRouter.delete("/delete/:id",authMiddleware, accessMiddleware(["admin" , "user"  ]), async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the to-do item by ID
    const deletedTodo = await todoModel.findByIdAndDelete(id);

    // If no to-do item is found with the given ID
    if (!deletedTodo) {
      return res.status(404).json({ error: "To-do item not found" });
    }
   
  

    // Respond with a success message
    res
      .status(200)
      .json({ message: "To-do deleted successfully", todo: deletedTodo });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete to-do" });
  }
});

module.exports = todoRouter;
