import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 11000:
        return response.status(400).json({
          statusCode: 400,
          createdBy: 'MongoExceptionFilter',
          error: 'The entered email has been already taken',
        });
      // duplicate exception
      // do whatever you want here, for instance send error to client
    }
  }
}
