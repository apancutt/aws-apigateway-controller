import { BodyParams } from '../types/BodyParams';
import { Headers } from '../types/Headers';
import { Params } from '../types/Params';
import { PathParams } from '../types/PathParams';
import { QueryParams } from '../types/QueryParams';
import { Status } from '../types/Status';
import { ErrorResponse } from '../ErrorResponse';
import { Middleware } from '../Middleware';
import { Request } from '../Request';
export declare type RuleSet = {
    required?: boolean;
    defaultValue?: any;
    sanitizer?: (value: string) => any;
    validator?: (value: any) => true;
};
export declare type SourceRuleSet = {
    [key: string]: RuleSet;
};
export declare type Rules = {
    [source in ParamSource]?: SourceRuleSet;
};
export declare type ParamSource = keyof Params;
export declare class BadRequestErrorResponse extends ErrorResponse {
    constructor(message?: string, previous?: Error, status?: Status, headers?: Headers);
}
export declare class RequiredParameterErrorResponse extends BadRequestErrorResponse {
    source: ParamSource;
    key: string;
    constructor(source: ParamSource, key: string, previous?: Error, status?: Status, headers?: Headers);
}
export declare class MalformedParameterErrorResponse extends BadRequestErrorResponse {
    source: ParamSource;
    key: string;
    constructor(source: ParamSource, key: string, previous?: Error, status?: Status, headers?: Headers);
}
export declare class InvalidParameterErrorResponse extends BadRequestErrorResponse {
    source: ParamSource;
    key: string;
    value: any;
    constructor(source: ParamSource, key: string, value: any, previous?: Error, status?: Status, headers?: Headers);
}
export declare class ParamRules implements Middleware {
    rules: Rules;
    constructor(rules: Rules);
    protected check(source: ParamSource, params: BodyParams | PathParams | QueryParams): void;
    request(request: Request): Request;
}
