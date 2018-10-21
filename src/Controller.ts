import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from './types/Handler';
import { ErrorResponse } from './ErrorResponse';
import { Middleware } from './Middleware'
import { Request } from './Request';
import { Response } from './Response';

export class Controller {

  public static async executeAPIGatewayProxyEvent(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: Handler, middlewares: Middleware[] = []): Promise<APIGatewayProxyResult> {
    try {
      return Controller.executeRequest(Request.fromAPIGatewayProxyEvent(event, context), handler, middlewares);
    } catch (err) {
      return Controller.respond(Promise.reject(err));
    }
  }

  public static async executeRequest(request: Request, handler: Handler, middlewares: Middleware[] = []): Promise<APIGatewayProxyResult> {
    return Controller.respond(
      Promise.resolve(request)
        .then((request) => middlewares.reduce((promise, middleware) => promise.then((request) => middleware.request ? middleware.request.call(middleware, request) : request), Promise.resolve(request)))
        .then(handler)
        .then((response) => middlewares.reduce((promise, middleware) => promise.then((response) => middleware.response ? middleware.response.call(middleware, response) : response), Promise.resolve(response)))
    );
  }

  protected static async respond(promise: Promise<Response>): Promise<APIGatewayProxyResult> {
    return promise
      .catch((err) => {

        if (!(err instanceof ErrorResponse)) {
          err = new ErrorResponse(undefined, err);
        }

        if (err.previous instanceof Error) {
          console.log(`ERROR: ${err.previous.stack}`);
        }

        return err.response;

      })
      .then((response) => response.toAPIGatewayProxyResult());
  }

}
