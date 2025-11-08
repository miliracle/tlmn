import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT Authentication Guard
 * Verifies JWT tokens and attaches user to request object
 * Handles token expiration and invalid tokens
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Handle token expiration
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token has expired');
    }

    // Handle invalid token
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid token');
    }

    // Handle other errors
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }

    return user;
  }
}
