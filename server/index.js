import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
dotenv.config()    // Env variables can be accessed

const app = express();

const PORT = process.env.PORT || 3000  // If the given port is not free then it will run at 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT, ()=>{
    console.log(`Server is running at port : ${PORT}`);
} )


app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);
