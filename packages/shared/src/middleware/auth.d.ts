import { Request, Response, NextFunction } from 'express';
import { AuthTokenPayload, UserRole } from '../types';
declare global {
    namespace Express {
        interface Request {
            user?: AuthTokenPayload;
        }
    }
}
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...allowedRoles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const generateToken: (payload: AuthTokenPayload) => string;
export declare const verifyToken: (token: string) => AuthTokenPayload;
//# sourceMappingURL=auth.d.ts.map