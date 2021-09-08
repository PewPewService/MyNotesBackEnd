"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
var ws = require('ws');
var WebSocket = /** @class */ (function () {
    function WebSocket() {
        try {
            var server_1 = new ws.Server({
                port: 4000,
                clientTracking: true,
            });
            server_1.on('connection', function (socket) {
                socket.on('message', function (msg) {
                    var message = JSON.parse(msg);
                    if (message.type == "identify") {
                        socket.user = message.user;
                    }
                    else if (message.type == "command") {
                        var user_1 = socket.user;
                        server_1.clients.forEach(function (element) {
                            if (element.user == user_1 && element != socket) {
                                element.send(message.command);
                            }
                        });
                    }
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    return WebSocket;
}());
exports.WebSocket = WebSocket;
