import { BodyParams } from '../types/BodyParams';
import { Headers } from '../types/Headers';
import { Params } from '../types/Params';
import { PathParams } from '../types/PathParams';
import { QueryParams } from '../types/QueryParams';
import { Status } from '../types/Status';
import { ErrorResponse } from '../ErrorResponse';
import { Middleware } from '../Middleware';
import { Request } from '../Request';

export type RuleSet = {
  required?: boolean;
  defaultValue?: any;
  sanitizer?: (value: string) => any;
  validator?: (value: any) => boolean;
};

export type SourceRuleSet = {
  [key: string]: RuleSet;
};

export type Rules = {
  [source in ParamSource]?: SourceRuleSet;
};

export type ParamSource = keyof Params;

export class BadRequestErrorResponse extends ErrorResponse {

  constructor(message?: string, previous?: Error, status: Status = 400, headers: Headers = {}) {
    super(message, previous, status);
  }

}

export class RequiredParameterErrorResponse extends BadRequestErrorResponse {

  public source: ParamSource;
  public key: string;

  constructor(source: ParamSource, key: string, previous?: Error, status: Status = 400, headers: Headers = {}) {

    super(`A value for ${source} parameter "${key}" is required`, previous, status, headers);

    this.source = source;
    this.key = key;

  }

}

export class MalformedParameterErrorResponse extends BadRequestErrorResponse {

  public source: ParamSource;
  public key: string;

  constructor(source: ParamSource, key: string, previous?: Error, status: Status = 400, headers: Headers = {}) {

    super(`The value provided for ${source} parameter "${key}" is malformed`, previous, status, headers);

    this.source = source;
    this.key = key;

  }

}

export class InvalidParameterErrorResponse extends BadRequestErrorResponse {

  public source: ParamSource;
  public key: string;
  public value: any;

  constructor(source: ParamSource, key: string, value: any, previous?: Error, status: Status = 400, headers: Headers = {}) {

    super(`The value provided for ${source} parameter "${key}" is invalid`, previous, status, headers);

    this.source = source;
    this.key = key;
    this.value = value;

  }

}

export class ParamRules implements Middleware {

  public rules: Rules;

  constructor(rules: Rules) {
    this.rules = rules;
  }

  protected check(source: ParamSource, params: BodyParams | PathParams | QueryParams) {

    const rules = this.rules[source] || {};

    Object.keys(rules).forEach((key) => {

      const { required, defaultValue, sanitizer, validator } = rules[key];

      params[key] = undefined !== params[key] ? params[key] : defaultValue;

      if (undefined !== sanitizer) {
        try {
          params[key] = sanitizer(params[key]);
        } catch (err) {
          throw err instanceof ErrorResponse ? err : new MalformedParameterErrorResponse(source, key, err);
        }
      }

      if (true === required && (undefined === params[key] || null === params[key])) {
        throw new RequiredParameterErrorResponse(source, key);
      }

      if (undefined !== validator) {
        try {
          if (false === validator(params[key])) {
            throw new TypeError('Validator returned false');
          }
        } catch (err) {
          throw err instanceof ErrorResponse ? err : new InvalidParameterErrorResponse(source, key, params[key], err);
        }
      }

    });

  }

  request(request: Request): Request {

    const sources: ParamSource[] = ['body', 'path', 'query'];

    sources.forEach((source) => {
      this.check(source, request.params[source]);
    });

    return request;

  }

}
