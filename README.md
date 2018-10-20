# aws-apigateway-controller

Simple handling of requests and responses within AWS API Gateway Lambda Proxy integrations running NodeJS 8.10.

## Installation

    npm install --save aws-apigateway-controller

## Usage

### NodeJS

    const { Controller, Request, Response } = require('aws-apigateway-controller');

    module.exports.handler = (event, context) => {

      return Controller.handle(event, context, (request) => {

        return new Response(200, `Executed handler for ${request.method} ${request.path} successfully.`);

      });

    };


### Typescript

Be sure to have run `npm install --save-dev @types/aws-lambda @types/node` to have the required types available.

    import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda'
    import { Controller, Request, Response } from 'aws-apigateway-controller';

    export async function handler(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) {

      return Controller.handle(event, context, (request: Request) => {

        return new Response(200, `Executed handler for ${request.method} ${request.path} successfully.`);

      });

    }
