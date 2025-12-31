
// ! Decare custom Enum for User Roles

import { Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
    User = "user",
    Admin = "admin"
};

// ! Declare custom properties on Express Request object

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
};

// ! Middleware to validate post data can be added here

const verifyRole = (...userRoles: UserRole[]) => {
    try {
        return async (req: Request, res: Response, next: Function) => {
            const sessionAuth = await auth.api.getSession({
                headers: req.headers as any,
            });

            if (!sessionAuth) {
                return res.status(403).json({ message: "Forbidden" });
            };

            if (!sessionAuth.user.emailVerified) {
                return res.status(403).json({ message: "Email not verified" });
            };

            req.user = {
                id: sessionAuth.user.id,
                name: sessionAuth.user.name,
                email: sessionAuth.user.email,
                role: sessionAuth.user.role as string,
                emailVerified: sessionAuth.user.emailVerified,
            };

            if (userRoles.length && !userRoles.includes(req.user.role as UserRole)) {
                return res.status(403).json({ success: false, message: "Forbidden Access!!" });
            };

            // console.log(sessionAuth);
            next();
        };
    }
    catch (err) {
        throw err;
    }
};


export default verifyRole;