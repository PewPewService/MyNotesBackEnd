import { Router, Response, Request } from "express";
import { UsersService } from "../services/users.service";

export class UsersConrtoller {
    public router: Router;
    public usersService!: UsersService;

    constructor(){
        this.usersService = new UsersService();
        this.router = Router();
        this.routes();
    }

    public register = async (req: Request, res: Response) => {
        const user = req.body;
        const result = await this.usersService.register(user);
        res.status(result.status).send(result.data);
        res.end();
    }

    public login = async (req: Request, res: Response) => {
        const user = req.body;
        const result = await this.usersService.login(user);
        res.status(result.status).send(result.data);
        res.end();
    }

    public routes(){
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }

}