import express, { NextFunction, Request, Response } from 'express';
import { NotesController } from './controllers/notes.controller';
import { createConnection } from 'typeorm';
import { UsersConrtoller } from './controllers/users.controller';
//import { WebSocket } from './websocket-server';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.' + process.env.MODE });

class Server {
    private NotesController!: NotesController;
    private UsersController!: UsersConrtoller;
    //private WebSocket!: WebSocket;

    private bodyParser;
    private app: express.Application;

    constructor() {
        this.app = express();
        this.bodyParser = require('body-parser');
        this.configuration();
        this.routes();
        //this.WebSocket = new WebSocket();
    }

    public configuration() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(this.bodyParser.json({limit: '100mb', extended: true}));
        this.app.use('/images', express.static(path.resolve(__dirname, '../images')));
        this.app.use(function(req: Request, res: Response, next: NextFunction) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    public uploadFiles(req: Record<string, any>, res: Response) {
        try {
            console.log(req.body);
            const imagesPaths: Array<string> = [];
            for (const image of req.files) {
                imagesPaths.push(image.path);
            }
            res.status(200).send(imagesPaths).json;
            res.end();
        } catch (err) {
            res.status(500).send(err);
            res.end();
        }
    }

    public async routes() {
        const ConnType : any = String(process.env.NODE_CONNECTION_TYPE);
        const ConnHost = String(process.env.NODE_CONNECTION_HOST);
        const ConnPort = Number(process.env.NODE_CONNECTION_PORT);
        const ConnUser = String(process.env.NODE_CONNECTION_USER);
        const ConnPassword = String(process.env.NODE_CONNECTION_PASSWORD);
        const ConnDB = String(process.env.NODE_CONNECTION_DB);
        const ConnEntities = String(process.env.NODE_CONNECTION_ENTITIES);
        const ConnSync = Boolean(process.env.NODE_CONNECTION_SYNCHRONIZE);
        const ConnName = String(process.env.NODE_CONNECTION_NAME);


        await createConnection({
            type: ConnType,
            host: ConnHost,
            port: ConnPort,
            username: ConnUser,
            password: ConnPassword,
            database: ConnDB,
            entities: [ConnEntities],
            synchronize: ConnSync,
            name: ConnName,
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
            //ssl: true,//{ rejectUnauthorized: false },
        });

        this.NotesController = new NotesController();
        this.UsersController = new UsersConrtoller();
        this.app.get('/', (req: Request, res: Response) => {
            res.send( req.get('host') );
        });
        this.app.use('/api/notes/', this.NotesController.router);
        this.app.use('/api/users/', this.UsersController.router);
    }

    public start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening on port ${this.app.get('port')}`);
        });
    }
}

const server = new Server();
server.start();
