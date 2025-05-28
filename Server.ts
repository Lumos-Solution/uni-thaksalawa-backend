import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/UserRoute';
import classRoutes from './routes/ClassRoute';
import path from 'path';

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
