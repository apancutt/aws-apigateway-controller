"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = require("query-string");
const ErrorResponse_1 = require("./ErrorResponse");
const Request_1 = require("./Request");
class Controller {
    static async handle(event, context, handler, middlewares = []) {
        return new Promise((resolve, reject) => {
            try {
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
                resolve(new Request_1.Request(event.httpMethod, event.path, headers, event.body, {
                    body: bodyParams,
                    path: event.pathParameters || {},
                    query: queryParams,
                }));
            }
            catch (err) {
                reject(err);
            }
        })
            .then((request) => middlewares.reduce((promise, middleware) => promise.then((request) => middleware.request ? middleware.request.call(middleware, request) : request), Promise.resolve(request)))
            .then(handler)
            .then((response) => middlewares.reduce((promise, middleware) => promise.then((response) => middleware.response ? middleware.response.call(middleware, response) : response), Promise.resolve(response)))
            .then((response) => {
            const promises = [];
            middlewares.forEach((middleware) => {
                if (middleware.response) {
                    promises.push(middleware.response(response));
                }
            });
            return Promise.all(promises)
                .then((promises) => promises.pop() || response);
        })
            .catch((err) => {
            if (!(err instanceof ErrorResponse_1.ErrorResponse)) {
                err = new ErrorResponse_1.ErrorResponse(undefined, err);
            }
            if (err.previous instanceof Error) {
                console.log(`ERROR: ${err.previous.stack}`);
            }
            return err.response;
        })
            .then((response) => ({
            body: null !== response.body ? response.body : '',
            headers: Object.assign({}, response.headers, { 'access-control-allow-origin': '*' }),
            statusCode: response.status,
        }));
    }
}
exports.Controller = Controller;
;
