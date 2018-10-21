"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = require("../ErrorResponse");
class BadRequestErrorResponse extends ErrorResponse_1.ErrorResponse {
    constructor(message, previous, status = 400, headers = {}) {
        super(message, previous, status);
    }
}
exports.BadRequestErrorResponse = BadRequestErrorResponse;
class RequiredParameterErrorResponse extends BadRequestErrorResponse {
    constructor(source, key, previous, status = 400, headers = {}) {
        super(`A value for ${source} parameter "${key}" is required`, previous, status, headers);
        this.source = source;
        this.key = key;
    }
}
exports.RequiredParameterErrorResponse = RequiredParameterErrorResponse;
class MalformedParameterErrorResponse extends BadRequestErrorResponse {
    constructor(source, key, previous, status = 400, headers = {}) {
        super(`The value for ${source} parameter "${key}" is malformed`, previous, status, headers);
        this.source = source;
        this.key = key;
    }
}
exports.MalformedParameterErrorResponse = MalformedParameterErrorResponse;
class InvalidParameterErrorResponse extends BadRequestErrorResponse {
    constructor(source, key, value, previous, status = 400, headers = {}) {
        super(`The value for ${source} parameter "${key}" is invalid: ${value}`, previous, status, headers);
        this.source = source;
        this.key = key;
        this.value = value;
    }
}
exports.InvalidParameterErrorResponse = InvalidParameterErrorResponse;
class ParamsMiddleware {
    constructor(rules) {
        this.rules = rules;
    }
    check(source, params) {
        const rules = this.rules[source] || {};
        Object.keys(rules).forEach((key) => {
            const { required, defaultValue, sanitizer, validator } = rules[key];
            params[key] = undefined !== params[key] ? params[key] : defaultValue;
            if (true === required && undefined === params[key]) {
                throw new RequiredParameterErrorResponse(source, key);
            }
            if (undefined !== sanitizer) {
                try {
                    params[key] = sanitizer(params[key]);
                }
                catch (err) {
                    throw err instanceof ErrorResponse_1.ErrorResponse ? err : new MalformedParameterErrorResponse(source, key);
                }
            }
            if (undefined !== validator) {
                try {
                    validator(params[key]);
                }
                catch (err) {
                    throw err instanceof ErrorResponse_1.ErrorResponse ? err : new InvalidParameterErrorResponse(source, key, params[key]);
                }
            }
        });
    }
    request(request) {
        const sources = ['body', 'path', 'query'];
        sources.forEach((source) => {
            this.check(source, request.params[source]);
        });
        return request;
    }
}
exports.ParamsMiddleware = ParamsMiddleware;
