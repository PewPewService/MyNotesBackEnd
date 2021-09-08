import {getConnection} from 'typeorm';
import {UsersRepository} from '../repository/users.repository';

export class UsersService {
    private UsersRepository: UsersRepository;

    constructor() {
        this.UsersRepository =
            getConnection('MyNotes').getCustomRepository(UsersRepository);
    }

    public register = async (user: object): Promise<Record<string, string | number | unknown>> => {
        const result = await this.UsersRepository.register(user);
        return result;
    };

    public login = async (user: object): Promise<Record<string, string | number | unknown>> => {
        const result = await this.UsersRepository.login(user);
        return result;
    };

    public auth = async (jwt: string): Promise<Record<string, string | number>> => {
        const result = await this.UsersRepository.auth(jwt);
        return result;
    };

    public reset = async (email: string, link: string): Promise<Record<string, unknown>> => {
        const result = await this.UsersRepository.reset(email, link);
        return result;
    };

    public changePassword = async (data: Record<string, string>): Promise<Record<string, string | number | unknown>> => {
        const result = await this.UsersRepository.changePassword(data);
        return result;
    }
}
