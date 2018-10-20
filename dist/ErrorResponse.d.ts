import { Response } from './Response';
import { Headers } from './types/Headers';
import { Status } from './types/Status';
export declare class ErrorResponse extends Error {
    response: Response;
    previous?: Error;
    constructor(message?: string, previous?: Error, status?: Status, headers?: Headers);
}
