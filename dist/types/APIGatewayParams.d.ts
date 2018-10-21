import { APIGatewayEvent, APIGatewayEventRequestContext } from 'aws-lambda';
export declare type APIGatewayParams = {
    event: APIGatewayEvent;
    context: APIGatewayEventRequestContext;
};
