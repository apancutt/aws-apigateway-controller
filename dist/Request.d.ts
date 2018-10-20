import { RequestBody } from './types/RequestBody';
import { Headers } from './types/Headers';
import { Method } from './types/Method';
import { Path } from './types/Path';
import { Query } from './types/Query';
export declare class Request {
    path: Path;
    method: Method;
    headers: Headers;
    query: Query;
    body: RequestBody;
    constructor(path: Path, method: Method, headers?: Headers, query?: Query, body?: RequestBody);
    static form(path: Path, method: Method, headers?: Headers, query?: Query, body?: RequestBody): Request;
    static json(path: Path, method: Method, headers?: Headers, query?: Query, body?: RequestBody): Request;
}
