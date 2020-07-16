"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cors = void 0;
class Cors {
    response(response) {
        response.headers['access-control-allow-origin'] = '*';
        return response;
    }
}
exports.Cors = Cors;
