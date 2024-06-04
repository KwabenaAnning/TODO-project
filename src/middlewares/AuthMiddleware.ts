import jwt, { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const checkAuthorizationToken = (authorization: string | undefined): string | null => {
    let bearerToken: string | null = null;
    if (authorization) {
        const token = authorization.split(' ')[1];
        bearerToken = token || authorization;
    }
    return bearerToken;
};

const verifyToken = (token: string, JWT_SECRET: string): any => {
    return verify(token, JWT_SECRET);
};

export default function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers["authorization"];
    const token = checkAuthorizationToken(authHeader);
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded; // Attach user object to request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
