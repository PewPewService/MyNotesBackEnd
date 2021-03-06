import {getConnection} from 'typeorm';
import {UsersRepository} from '../repository/users.repository';

export class UsersService {
    private UsersRepository: UsersRepository;

    constructor() {
        this.UsersRepository =
        getConnection('MyNotes').getCustomRepository(UsersRepository);
    }

    public register = async (user: object): Promise<any> => {
        const result = await this.UsersRepository.register(user);
        return result;
    };

    public login = async (user: object): Promise<any> => {
        const result = await this.UsersRepository.login(user);
        return result;
    };

    public auth = async (jwt: string): Promise<any> => {
        const result = await this.UsersRepository.auth(jwt);
        return result;
    };
}
