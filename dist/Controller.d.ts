import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { Request } from './Request';
import { Response } from './Response';
export declare class Controller {
    static handle(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: (request: Request) => Response | Promise<Response>): Promise<APIGatewayProxyResult>;
}
