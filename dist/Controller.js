"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse_1 = require("./ErrorResponse");
const Request_1 = require("./Request");
class Controller {
    static async handle(event, context, handler) {
        return new Promise((resolve, reject) => {
            try {
                const body = event.body;
                const headers = event.headers;
                const path = event.path;
                const query = event.queryStringParameters || {};
                let method;
                switch (event.httpMethod) {
                    case 'DELETE':
                    case 'GET':
                    case 'HEAD':
                    case 'POST':
                    case 'PUT':
                    case 'STATUS':
                        method = event.httpMethod;
                        break;
                    default:
                        throw new ErrorResponse_1.ErrorResponse(`Method "${event.httpMethod}" is not supported`, undefined, 405);
                }
                let request;
                switch (event.headers['content-type']) {
                    case 'application/json':
                        request = Request_1.Request.json(path, method, headers, query, body);
                        break;
                    case 'application/x-www-form-urlencoded':
                        request = Request_1.Request.form(path, method, headers, query, body);
                        break;
                    default:
                        request = new Request_1.Request(path, method, headers, query, body);
                }
                resolve(request);
            }
            catch (err) {
                reject(err);
            }
        })
            .then(handler)
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
