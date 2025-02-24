import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('Intercept');

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token) {
        console.log("🚀 ~ AuthTokenInterceptor ~ intercept ~ token:", token)
    } else {
        throw new UnauthorizedException('Token nao informado');
    }

    return next.handle();
  }
}
