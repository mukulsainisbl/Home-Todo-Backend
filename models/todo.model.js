const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true }
  },
  {
    versionKey: false,
    timestamps: true,
   
  }
);

const todoModel = mongoose.model("Todo", TodoSchema);

module.exports = todoModel;
