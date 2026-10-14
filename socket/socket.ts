import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server;

export const initSocket = (httpServer: any, origin: string) => {
    console.log('Socket.IO initialised');

    io = new Server(httpServer, { cors: { origin } });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                console.log('socket rejected: no token sent');
                return next(new Error('unauthorized'));
            }

            const secret = process.env.JWT_ACCESS_SECRET;
            if (!secret) {
                console.log('socket rejected: JWT_ACCESS_SECRET is not set in .env');
                return next(new Error('unauthorized'));
            }

            const p: any = jwt.verify(token, secret);
            socket.join(p.userName); // one room per user
            console.log('socket connected:', p.userName);
            next();
        } catch (err: any) {
            console.log('socket rejected:', err.message);
            next(new Error('unauthorized'));
        }
    });
};

export const notify = (userName: string, event: string, data: any = {}) =>
    io?.to(userName).emit(event, data);