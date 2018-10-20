"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const ErrorResponse_1 = require("./ErrorResponse");
class Request {
    constructor(path, method, headers = {}, query = {}, body = null) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.query = query;
        this.body = body;
    }
    static form(path, method, headers = {}, query = {}, body = null) {
        if (null !== body) {
            try {
                body = querystring_1.parse(body);
            }
            catch (err) {
                throw new ErrorResponse_1.ErrorResponse(`Failed to parse request body as form`, err, 400);
            }
        }
        return new this(path, method, headers, query, body);
    }
    static json(path, method, headers = {}, query = {}, body = null) {
        if (null !== body) {
            try {
                body = JSON.parse(body);
            }
            catch (err) {
                throw new ErrorResponse_1.ErrorResponse(`Failed to parse request body as JSON`, err, 400);
            }
        }
        return new this(path, method, headers, query, body);
    }
}
exports.Request = Request;
;
