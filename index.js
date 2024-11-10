require('dotenv').config()
const express = require('express')
const connection = require('./config/db')
const userRouter = require('./routes/user.route')
const todoRouter = require('./routes/todo.route')
const cors = require("cors")
const app = express()
app.use(express.json())

const corsOptions = {
    origin: 'https://home-todo-frontend-yq56-hy16y1wjk-mukulsainisbls-projects.vercel.app', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204, // For legacy browser support
  };
  
  // Use CORS with specific options
  app.use(cors(corsOptions));

app.use('/user' , userRouter)
app.use('/todo' , todoRouter)

app.get('/health' , (req,res) => {
    res.status(200).json({Msg : "Health OK"})
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

