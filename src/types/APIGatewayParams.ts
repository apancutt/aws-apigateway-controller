import { APIGatewayEvent, APIGatewayEventRequestContext } from 'aws-lambda';

export type APIGatewayParams = {
  event: APIGatewayEvent;
  context: APIGatewayEventRequestContext;
};
