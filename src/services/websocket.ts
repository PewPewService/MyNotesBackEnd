const ws = require('ws');

export class WebSocket {

    constructor() {
        try {
            let server = new ws.Server({
                port: 4000,
                clientTracking: true,
            });
            server.on('connection', function(socket: any) {

                socket.on('message', (msg: any) => {
                    let message: Record<string, string> = JSON.parse(msg);
                    if (message.type == "identify") {
                        socket.user = message.user;
                    } else if (message.type == "command") {
                        let user = socket.user;
                        server.clients.forEach((element: any) => {
                            if (element.user == user && element != socket) {
                                element.send(message.command);
                            }
                        });
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }

    }
}