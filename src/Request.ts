import { Body } from './types/Body';
import { Headers } from './types/Headers';
import { Method } from './types/Method';
import { Params } from './types/Params';
import { Path } from './types/Path';

export class Request {

  public body: Body;
  public headers: Headers;
  public method: Method;
  public path: Path;
  public params: Params;

  constructor(method: Method, path: Path, headers: Headers = {}, body: Body = null, params: Params = {body: {}, path: {}, query: {}}) {
    this.body = body;
    this.headers = headers;
    this.method = method;
    this.params = params;
    this.path = path;
  }

};
