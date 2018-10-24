import { Middleware } from '../Middleware';
import { Response } from '../Response';

export class Cors implements Middleware {

  public response(response: Response): Response {
    response.headers['access-control-allow-origin'] = '*';
    return response;
  }

}
