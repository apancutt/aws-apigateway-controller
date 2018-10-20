import { Response } from './Response';
import { Headers } from './types/Headers';
import { Status } from './types/Status';

export class ErrorResponse extends Error {

  public response: Response;
  public previous?: Error;

  constructor(message?: string, previous?: Error, status: Status = 500, headers: Headers = {}) {

    super(message);

    this.response = Response.json(status, {
      error: message ? message : Response.statusMessage(status) || 'Unknown error',
    }, headers);

    this.previous = previous;

  }

}
