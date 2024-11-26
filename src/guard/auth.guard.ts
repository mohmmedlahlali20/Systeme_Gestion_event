import { 
    CanActivate, 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
} from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuth implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new UnauthorizedException('Token not found');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;
            console.log(decoded);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
