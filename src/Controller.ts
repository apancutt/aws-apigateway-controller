import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { Method } from './types/Method';
import { ErrorResponse } from './ErrorResponse';
import { Request } from './Request';
import { Response } from './Response';

export class Controller {

  static async handle(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: (request: Request) => Response | Promise<Response>): Promise<APIGatewayProxyResult> {

    return new Promise((resolve: (request: Request) => void, reject) => {

      try {

        const body = event.body;
        const headers = event.headers;
        const path = event.path;
        const query = event.queryStringParameters || {};

        let method: Method;

        switch (event.httpMethod) {
          case 'DELETE':
          case 'GET':
          case 'HEAD':
          case 'POST':
          case 'PUT':
          case 'STATUS':
            method = event.httpMethod;
            break;
          default:
            throw new ErrorResponse(`Method "${event.httpMethod}" is not supported`, undefined, 405);
        }

        let request: Request;

        switch (event.headers['content-type']) {
          case 'application/json':
            request = Request.json(path, method, headers, query, body);
            break;
          case 'application/x-www-form-urlencoded':
            request = Request.form(path, method, headers, query, body);
            break;
          default:
            request = new Request(path, method, headers, query, body);
        }

        resolve(request);

      } catch (err) {

        reject(err);

      }

    })

      .then(handler)

      .catch((err) => {

        if (!(err instanceof ErrorResponse)) {
          err = new ErrorResponse(undefined, err);
        }

        if (err.previous instanceof Error) {
          console.log(`ERROR: ${err.previous.stack}`);
        }

        return err.response;

      })

      .then((response) => ({
        body: null !== response.body ? response.body : '',
        headers: {
          ...response.headers,
          'access-control-allow-origin': '*',
        },
        statusCode: response.status,
      }));

  }

};
