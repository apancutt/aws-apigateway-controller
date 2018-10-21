"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Request {
    constructor(method, path, headers = {}, body = null, params = { body: {}, path: {}, query: {} }) {
        this.body = body;
        this.headers = headers;
        this.method = method;
        this.params = params;
        this.path = path;
    }
}
exports.Request = Request;
;
