const express = require("express");
const userModel = require("../models/user.model");
const userRouter = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken')



userRouter.get('/', async (req, res) => {
    try {
        const allUsers = await userModel.find();

        if (allUsers.length === 0) {
            return res.status(404).json({ msg: "No users found" });
        }

        res.status(200).json({ msg: "All Users", users: allUsers });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


userRouter.post("/register", async (req, res) => {
  try {
    const { firstName, secondName, email, password , role } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with destructured fields
    const newUser = new userModel({
      firstName,
      secondName,
      email,
      role,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: `${firstName}  registered successfully!` });
  } catch (error) {
    res.status(500).json({ error: "User registration failed" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
   
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role:user.role}, // Payload data
      process.env.SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with the token
    res.status(200).json({ message: `${user.firstName} Login successful!`, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = userRouter;
