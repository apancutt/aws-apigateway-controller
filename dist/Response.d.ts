import { Body } from './types/Body';
import { Headers } from './types/Headers';
import { Status } from './types/Status';
export declare class Response {
    body: Body;
    headers: Headers;
    status: Status;
    constructor(status: Status, body?: Body, headers?: Headers);
    readonly status_message: string | undefined;
    static statusMessage(status: Status): string | undefined;
    static json(status: Status, data: any, headers?: Headers): Response;
}
