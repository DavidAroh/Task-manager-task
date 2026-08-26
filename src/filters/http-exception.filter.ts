/**
 * HttpExceptionFilter - Global exception filter for consistent error responses.
 *
 * NestJS Concepts Demonstrated:
 * - Exception Filters catch errors thrown in controllers/services
 * - @Catch() decorator specifies which exceptions to handle
 * - Global filters apply to all routes
 * - Consistent error response format for API consumers
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(typeof message === 'string'
        ? { message }
        : { error: message }),
    });
  }
}
