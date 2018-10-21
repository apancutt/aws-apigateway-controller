import { APIGatewayParams } from './APIGatewayParams';
import { BodyParams } from './BodyParams';
import { PathParams } from './PathParams';
import { QueryParams } from './QueryParams';
export declare type Params = {
    apigateway?: APIGatewayParams;
    body: BodyParams;
    path: PathParams;
    query: QueryParams;
};
