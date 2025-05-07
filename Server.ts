import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routers/UserRoute';
import classRoutes from './routers/ClassRoute';

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
