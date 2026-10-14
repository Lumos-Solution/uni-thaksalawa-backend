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
import { initSocket } from './socket/socket';
import http from 'http';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
// Multer writes under the process working directory, so the static mount has to
// point there too - not at the compiled __dirname.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/user', userRoutes);
app.use('/api/class', classRoutes);
app.use('/api/userClassDetails', userClassDetailsRoute);

const server = http.createServer(app);
initSocket(server, process.env.CLIENT_ORIGIN || 'http://localhost:5173');
// The database is connected first so that no request can arrive while mongoose
// is still unconnected - those requests would otherwise sit in the driver's
// buffer and fail with an opaque timeout.
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});
