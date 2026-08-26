import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

/*
 * All JWT settings come from the environment so that secrets never live in the
 * repository. See .env.example for the variables that have to be provided.
 */
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error(
        'ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set. Copy .env.example to .env and fill them in.'
    );
}

export interface AuthPayload extends JwtPayload {
    sub: string;        // the user's mongo _id
    userName: string;
    userType: string;
}

type TokenClaims = Omit<AuthPayload, keyof JwtPayload> & { sub: string };

export const signAccessToken = (claims: TokenClaims) =>
    jwt.sign(claims, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as SignOptions);

export const signRefreshToken = (claims: TokenClaims) =>
    jwt.sign(claims, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as SignOptions);

export const verifyAccessToken = (token: string): AuthPayload =>
    jwt.verify(token, ACCESS_TOKEN_SECRET) as AuthPayload;

export const verifyRefreshToken = (token: string): AuthPayload =>
    jwt.verify(token, REFRESH_TOKEN_SECRET) as AuthPayload;
