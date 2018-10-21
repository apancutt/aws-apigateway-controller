import { APIGatewayProxyResult } from 'aws-lambda';
import { Body } from './types/Body';
import { Headers } from './types/Headers';
import { Status } from './types/Status';

const statusMessages: {[key: number]: string} = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Unordered Collection',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  444: 'Connection Closed Without Response',
  449: 'Retry With',
  450: 'Blocked By Windows Parental Controls',
  451: 'Unavailable For Legal Reasons',
  499: 'Client Closed Request',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
  599: 'Network Connect Timeout Error',
};

export class Response {

  public body: Body;
  public headers: Headers;
  public status: Status;

  public constructor(status: Status, body: Body = null, headers: Headers = {}) {
    this.status = status;
    this.body = body;
    this.headers = {...headers};
  }

  public get status_message() {
    return Response.statusMessage(this.status);
  }

  public toAPIGatewayProxyResult(): APIGatewayProxyResult {
    return {
      body: null !== this.body ? this.body : '',
      headers: this.headers,
      statusCode: this.status,
    };
  }

  public static statusMessage(status: Status): string | undefined {
    return statusMessages[status];
  }

  public static fromJSON(json: any, status: Status = 200, headers: Headers = {}) {
    return new this(status, (null !== json && undefined !== json) ? JSON.stringify(json) : null, {
      ...headers,
      'content-type': 'application/json',
    });
  }

}
