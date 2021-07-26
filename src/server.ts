import express, {NextFunction, Request, Response} from 'express';
import {NotesController} from './controllers/notes.controller';
import {createConnection} from 'typeorm';
import {UsersConrtoller} from './controllers/users.controller';

class Server {
    private NotesController!: NotesController;
    private UsersController!: UsersConrtoller;
    private bodyParser;
    private app: express.Application;

    constructor() {
      this.app = express();
      this.bodyParser = require('body-parser');
      this.configuration();
      this.routes();
    }

    public configuration() {
      this.app.set('port', process.env.PORT || 3000);
      // this.app.use(express.json());
      this.app.use(this.bodyParser.json({limit: '50mb', extended: true}));
      this.app.use(function(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept');
        next();
      });
      console.log(process.env);
    }

    public async routes() {
      // await createConnection({
      //     type: "postgres",
      //     host: "localhost",
      //     port: 5432,
      //     username: "dbUser",
      //     password: "0000",
      //     database: "MyNotes",
      //     entities: ["build/database/entities/**/*.js"],
      //     synchronize: true,
      //     name: "MyNotes"
      // });
      const ConnType : any = String(process.env.NODE_CONNECTION_TYPE);
      const ConnHost : any = String(process.env.NODE_CONNECTION_HOST);
      const ConnPort : any = Number(process.env.NODE_CONNECTION_PORT);
      const ConnUser : any = String(process.env.NODE_CONNECTION_USER);
      const ConnPassword : any = String(process.env.NODE_CONNECTION_PASSWORD);
      const ConnDB : any = String(process.env.NODE_CONNECTION_DB);
      const ConnEntities : any = String(process.env.NODE_CONNECTION_ENTITIES);
      const ConnSync : any = Boolean(process.env.NODE_CONNECTION_SYNCHRONIZE);
      const ConnName : any = String(process.env.NODE_CONNECTION_NAME);


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
      });

      this.NotesController = new NotesController();
      this.UsersController = new UsersConrtoller();
      this.app.get('/', (req: Request, res: Response) => {
        res.send('test');
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
