import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';

export type APIGatewayParams = {
  event: APIGatewayProxyEvent;
  context: APIGatewayEventRequestContext;
};
