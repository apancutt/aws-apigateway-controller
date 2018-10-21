import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from './types/Handler';
import { Middleware } from './Middleware';
export declare class Controller {
    static handle(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: Handler, middlewares?: Middleware[]): Promise<APIGatewayProxyResult>;
}
