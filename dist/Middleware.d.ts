import { Request } from './Request';
import { Response } from './Response';
export interface Middleware {
    request?: (request: Request) => Request | Promise<Request>;
    response?: (response: Response) => Response | Promise<Response>;
}
