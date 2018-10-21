import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { Body } from './types/Body';
import { Headers } from './types/Headers';
import { Method } from './types/Method';
import { Params } from './types/Params';
import { Path } from './types/Path';
export declare class Request {
    body: Body;
    headers: Headers;
    method: Method;
    path: Path;
    params: Params;
    constructor(method: Method, path: Path, headers?: Headers, body?: Body, params?: Params);
    static fromAPIGatewayProxyEvent(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): Request;
}
