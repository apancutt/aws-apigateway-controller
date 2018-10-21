import { Request } from '../Request';
import { Response } from '../Response';
export declare type Handler = (request: Request) => Response | Promise<Response>;
