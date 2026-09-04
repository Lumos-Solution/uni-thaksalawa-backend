// Loaded first so that every module below (JWT config in particular) can read
// its secrets out of process.env.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/UserRoute';
import classRoutes from './routes/ClassRoute';
import path from 'path';
import userClassDetailsRoute from "./routes/UserClassDetailsRoute";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/userClassDetails', userClassDetailsRoute);

// The database is connected first so that no request can arrive while mongoose
// is still unconnected - those requests would otherwise sit in the driver's
// buffer and fail with an opaque timeout.
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
