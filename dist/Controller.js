"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const ErrorResponse_1 = require("./ErrorResponse");
const Request_1 = require("./Request");
class Controller {
    static async executeAPIGatewayProxyEvent(event, context, handler, middlewares = []) {
        try {
            return Controller.executeRequest(Request_1.Request.fromAPIGatewayProxyEvent(event, context), handler, middlewares);
        }
        catch (err) {
            return Controller.respond(Promise.reject(err));
        }
    }
    static async executeRequest(request, handler, middlewares = []) {
        return Controller.respond(Promise.resolve(request)
            .then((request) => middlewares.reduce((promise, middleware) => promise.then((request) => middleware.request ? middleware.request.call(middleware, request) : request), Promise.resolve(request)))
            .then(handler)
            .then((response) => middlewares.reduce((promise, middleware) => promise.then((response) => middleware.response ? middleware.response.call(middleware, response) : response), Promise.resolve(response))));
    }
    static async respond(promise) {
        return promise
            .catch((err) => {
            if (!(err instanceof ErrorResponse_1.ErrorResponse)) {
                err = new ErrorResponse_1.ErrorResponse(undefined, err);
            }
            if (err.previous instanceof Error) {
                console.log(`ERROR: ${err.previous.stack}`);
            }
            return err.response;
        })
            .then((response) => response.toAPIGatewayProxyResult());
    }
}
exports.Controller = Controller;
