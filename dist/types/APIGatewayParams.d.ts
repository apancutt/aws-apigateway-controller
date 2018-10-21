import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';
export declare type APIGatewayParams = {
    event: APIGatewayProxyEvent;
    context: APIGatewayEventRequestContext;
};
