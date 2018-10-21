import { APIGatewayProxyEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import { parse as parseQueryString, stringify as stringifyQueryString, ParseOptions, StringifyOptions } from 'query-string';
import { BodyParams } from './types/BodyParams';
import { Handler } from './types/Handler';
import { Headers } from './types/Headers';
import { QueryParams } from './types/QueryParams';
import { ErrorResponse } from './ErrorResponse';
import { Middleware } from './Middleware'
import { Request } from './Request';

export class Controller {

  static async handle(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, handler: Handler, middlewares: Middleware[] = []): Promise<APIGatewayProxyResult> {

    return new Promise((resolve: (request: Request) => void, reject) => {

      try {

        const queryStringOptions: ParseOptions & StringifyOptions = {
          arrayFormat: 'bracket',
        };

        switch (event.httpMethod) {
          case 'DELETE':
          case 'GET':
          case 'HEAD':
          case 'POST':
          case 'PUT':
          case 'STATUS':
            break;
          default:
            throw new ErrorResponse(`Method "${event.httpMethod}" is not allowed`, undefined, 405);
        }

        const headers: Headers = {};
        Object.keys(event.headers).forEach((key) => {
          headers[key.toLowerCase()] = event.headers[key];
        });

        let bodyParams: BodyParams = {};
        if (null !== event.body) {

          let parser: ((value: string) => any) | null = null;

          switch (headers['content-type']) {
            case 'application/json':
              parser = JSON.parse;
              break;
            case 'application/x-www-form-urlencoded':
              parser = (value) => parseQueryString(value, queryStringOptions);
              break;
          }

          if (null !== parser) {
            try {
              bodyParams = parser(event.body);
            } catch (err) {
              throw new ErrorResponse(`Request body is malformed`, err, 400);
            }
          }

        }

        let queryParams: QueryParams = {};
        if (event.queryStringParameters) {
          queryParams = parseQueryString(stringifyQueryString(event.queryStringParameters, queryStringOptions), queryStringOptions);
        }

        resolve(new Request(
          event.httpMethod,
          event.path,
          headers,
          event.body,
          {
            apigateway: {
              event,
              context
            },
            body: bodyParams,
            path: event.pathParameters || {},
            query: queryParams,
          },
        ));

      } catch (err) {

        reject(err);

      }

    })

      .then((request) => middlewares.reduce((promise, middleware) => promise.then((request) => middleware.request ? middleware.request.call(middleware, request) : request), Promise.resolve(request)))

      .then(handler)

      .then((response) => middlewares.reduce((promise, middleware) => promise.then((response) => middleware.response ? middleware.response.call(middleware, response) : response), Promise.resolve(response)))

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
        headers: response.headers,
        statusCode: response.status,
      }));

  }

};
