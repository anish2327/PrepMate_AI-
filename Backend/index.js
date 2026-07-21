import express from 'express';

import cors from 'cors'
import connectDB from './config/connectDb.js';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js';
import interviewRouter from "./routes/interview.route.js";
dotenv.config();

const app = express()







app.use(express.json());
app.use(cors({
    origin :[ 
    "http://localhost:5173",
    "https://prep-mate-ai-4165.vercel.app",
    ],

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})) 

app.use("/api",userRouter);
app.use("/api/interview", interviewRouter);

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


connectDB().then(() => {
  console.log("DB Connected, starting server...");

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});

