require('dotenv').config()
const express = require('express')
const connection = require('./config/db')
const userRouter = require('./routes/user.route')
const todoRouter = require('./routes/todo.route')
const cors = require("cors")
const app = express()

app.use(express.json())

const corsOptions = {
    origin: process.env.FRONTEND_URL , // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers,         etc.)
  };
  
  // Use CORS with specific options
  app.use(cors(corsOptions));

app.use('/user' , userRouter)
app.use('/todo' , todoRouter)

app.get('/' , (req,res) => {
    res.status(200).json({Msg : "Connected"})
})


app.listen(process.env.PORT || 8080, async()=>{
    try {
        await connection
        console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }
    console.log(`server is running on ${process.env.PORT}`)
})

