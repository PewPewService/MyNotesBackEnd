import express, { NextFunction, Request, Response } from "express";
import { NotesController } from "./controllers/notes.controller";
import { createConnection } from "typeorm";
import { UsersConrtoller } from "./controllers/users.controller";

class Server{
    private NotesController!: NotesController;
    private UsersController!: UsersConrtoller;
    private bodyParser;
    private app: express.Application;

    constructor(){
        this.app = express();
        this.bodyParser = require("body-parser");
        this.configuration();
        this.routes();
    }

    public configuration(){
        this.app.set('port', process.env.PORT || 3000);
        //this.app.use(express.json()); 
        this.app.use(this.bodyParser.json({limit: '50mb', extended: true}));
        this.app.use(function (req: Request, res: Response, next: NextFunction) { 
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });
    }

    public async routes(){
        await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "dbUser",
            password: "0000",
            database: "MyNotes",
            entities: ["build/database/entities/**/*.js"],
            synchronize: true,
            name: "MyNotes"
        });
        
        this.NotesController = new NotesController();
        this.UsersController = new UsersConrtoller();
        this.app.get('/', (req: Request, res: Response) => {
            res.send('test');
        })
        this.app.use('/api/notes/', this.NotesController.router);
        this.app.use('/api/users/', this.UsersController.router);
    }

    public start(){
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server is listening on port ${this.app.get('port')}`);
        })
    }
}

const server = new Server();
server.start();