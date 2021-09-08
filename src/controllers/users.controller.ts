import { Router, Response, Request } from 'express';
import { UsersService } from '../services/users.service';

export class UsersConrtoller {
    public router: Router;
    public usersService!: UsersService;

    constructor() {
        this.usersService = new UsersService();
        this.router = Router();
        this.routes();
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        const user = req.body;
        const result = await this.usersService.register(user);
        res.status(Number(result.status)).send(result.data);
        res.end();
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        const user = req.body;
        const result = await this.usersService.login(user);
        res.status(Number(result.status)).send(result.data);
        res.end();
    };

    public passwordReset = async (req: Request, res: Response): Promise<void> => {
        const email = req.body.email;
        const link = req.body.route;
        const result = await this.usersService.reset(email, link);
        res.status(Number(result.status)).send(result.data);
        res.end();
    };

    public ChangePassword = async (req: Request, res: Response): Promise<void> => {
        const result = await this.usersService.changePassword(req.body.data);
        res.status(Number(result.status)).send(result.data);
        res.end();
    };

    public routes(): void {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
        this.router.post('/passwordReset', this.passwordReset);
        this.router.post('/changePassword', this.ChangePassword);
    };
}
