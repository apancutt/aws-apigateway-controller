"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = require("query-string");
const ErrorResponse_1 = require("./ErrorResponse");
class Request {
    constructor(method, path, headers = {}, body = null, params = { body: {}, path: {}, query: {} }) {
        this.body = body;
        this.headers = headers;
        this.method = method;
        this.params = params;
        this.path = path;
    }
    static fromAPIGatewayProxyEvent(event, context) {
        const queryStringOptions = {
            arrayFormat: 'bracket',
        };
        switch (event.httpMethod) {
            case 'DELETE':
            case 'GET':
            case 'HEAD':
            case 'POST':
            case 'PUT':
            case 'STATUS':
                break;
            default:
                throw new ErrorResponse_1.ErrorResponse(`Method "${event.httpMethod}" is not allowed`, undefined, 405);
        }
        const headers = {};
        Object.keys(event.headers).forEach((key) => {
            headers[key.toLowerCase()] = event.headers[key];
        });
        let bodyParams = {};
        if (null !== event.body) {
            let parser = null;
            switch (headers['content-type']) {
                case 'application/json':
                    parser = JSON.parse;
                    break;
                case 'application/x-www-form-urlencoded':
                    parser = (value) => query_string_1.parse(value, queryStringOptions);
                    break;
            }
            if (null !== parser) {
                try {
                    bodyParams = parser(event.body);
                }
                catch (err) {
                    throw new ErrorResponse_1.ErrorResponse(`Request body is malformed`, err, 400);
                }
            }
        }
        let queryParams = {};
        if (event.queryStringParameters) {
            queryParams = query_string_1.parse(query_string_1.stringify(event.queryStringParameters, queryStringOptions), queryStringOptions);
        }
        return new Request(event.httpMethod, event.path, headers, event.body, {
            apigateway: {
                event,
                context
            },
            body: bodyParams,
            path: event.pathParameters || {},
            query: queryParams,
        });
    }
}
exports.Request = Request;
;
