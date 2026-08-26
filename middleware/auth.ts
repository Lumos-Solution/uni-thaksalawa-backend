import { NextFunction, Request, Response } from 'express';
import { AuthPayload, verifyAccessToken } from '../config/jwt';

declare global {
    namespace Express {
        interface Request {
            auth?: AuthPayload;
        }
    }
}

/**
 * Rejects the request unless it carries a valid `Authorization: Bearer <token>`
 * header. On success the decoded payload is attached as `req.auth`.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication token missing' });
        return;
    }

    try {
        req.auth = verifyAccessToken(header.slice('Bearer '.length).trim());
        next();
    } catch (err: any) {
        const expired = err?.name === 'TokenExpiredError';
        res.status(401).json({
            message: expired ? 'Token expired' : 'Invalid token',
            expired,
        });
    }
};

/**
 * Allows the request only when the authenticated user is acting on their own
 * record. `source` says where the target userName is read from.
 */
export const authorizeSelf = (
    field = 'userName',
    source: 'params' | 'body' | 'query' = 'params'
) => (req: Request, res: Response, next: NextFunction) => {
    const target = (req[source] as Record<string, any>)?.[field];

    if (!req.auth) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    if (target && target !== req.auth.userName) {
        res.status(403).json({ message: 'You are not allowed to act on another user' });
        return;
    }

    next();
};
