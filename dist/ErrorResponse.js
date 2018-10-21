"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class ErrorResponse extends Error {
    constructor(message, previous, status = 500, headers = {}) {
        super(message);
        this.response = Response_1.Response.fromJSON({
            error: message ? message : Response_1.Response.statusMessage(status) || 'Unknown error',
        }, status, headers);
        this.previous = previous;
    }
}
exports.ErrorResponse = ErrorResponse;
