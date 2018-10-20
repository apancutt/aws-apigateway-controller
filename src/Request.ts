import { parse as parseQueryString } from 'querystring';
import { RequestBody } from './types/RequestBody';
import { Headers } from './types/Headers';
import { Method } from './types/Method';
import { Path } from './types/Path';
import { Query } from './types/Query';
import { ErrorResponse } from './ErrorResponse';

export class Request {

  public path: Path;
  public method: Method;
  public headers: Headers;
  public query: Query;
  public body: RequestBody;

  constructor(path: Path, method: Method, headers: Headers = {}, query: Query = {}, body: RequestBody = null) {
    this.path = path;
    this.method = method;
    this.headers = headers;
    this.query = query;
    this.body = body;
  }

  static form(path: Path, method: Method, headers: Headers = {}, query: Query = {}, body: RequestBody = null) {

    if (null !== body) {
      try {
        body = parseQueryString(body);
      } catch (err) {
        throw new ErrorResponse(`Failed to parse request body as form`, err, 400);
      }
    }

    return new this(path, method, headers, query, body);

  }

  static json(path: Path, method: Method, headers: Headers = {}, query: Query = {}, body: RequestBody = null) {

    if (null !== body) {
      try {
        body = JSON.parse(body);
      } catch (err) {
        throw new ErrorResponse(`Failed to parse request body as JSON`, err, 400);
      }
    }

    return new this(path, method, headers, query, body);

  }

};
