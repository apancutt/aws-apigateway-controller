import { Headers } from './types/Headers';
import { ResponseBody } from './types/ResponseBody';
import { Status } from './types/Status';
export declare class Response {
    body: ResponseBody;
    headers: Headers;
    status: Status;
    constructor(status: Status, body?: ResponseBody, headers?: Headers);
    readonly status_message: string | undefined;
    static statusMessage(status: Status): string | undefined;
    static json(status: Status, data: any, headers?: Headers): Response;
}
