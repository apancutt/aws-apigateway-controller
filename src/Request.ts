import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { parse as parseQueryString, stringify as stringifyQueryString, ParseOptions, StringifyOptions } from 'query-string';
import { Body } from './types/Body';
import { BodyParams } from './types/BodyParams';
import { Headers } from './types/Headers';
import { Method } from './types/Method';
import { Params } from './types/Params';
import { Path } from './types/Path';
import { QueryParams } from './types/QueryParams';
import { ErrorResponse } from './ErrorResponse';

export class Request {

  public body: Body;
  public headers: Headers;
  public method: Method;
  public path: Path;
  public params: Params;

  public constructor(method: Method, path: Path, headers: Headers = {}, body: Body = null, params: Params = {body: {}, path: {}, query: {}}) {
    this.body = body;
    this.headers = headers;
    this.method = method;
    this.params = params;
    this.path = path;
  }

  public static fromAPIGatewayProxyEvent(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext): Request {

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

    return new Request(
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
    );

  }

};
