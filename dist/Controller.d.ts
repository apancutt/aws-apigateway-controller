import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from './types/Handler';
import { Middleware } from './Middleware';
import { Request } from './Request';
import { Response } from './Response';
export declare class Controller {
    static executeAPIGatewayProxyEvent(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: Handler, middlewares?: Middleware[]): Promise<APIGatewayProxyResult>;
    static executeRequest(request: Request, handler: Handler, middlewares?: Middleware[]): Promise<APIGatewayProxyResult>;
    protected static respond(promise: Promise<Response>): Promise<APIGatewayProxyResult>;
}
