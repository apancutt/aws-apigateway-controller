import { Middleware } from '../Middleware';
import { Response } from '../Response';
export declare class Cors implements Middleware {
    response(response: Response): Response;
}
