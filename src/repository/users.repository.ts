import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from '../database/entities/users.entity';
import { PasswordResetsService } from '../services/passwordresets.service';
import PasswordReset from '../services/email.service';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
    public bcrypt = require('bcryptjs');
    public jwt = require('jsonwebtoken');
    private PasswordResetsService = new PasswordResetsService();


    private async checkEmail(email: string): Promise<Record<string, any>> {
        try {
            const user = await this.createQueryBuilder('Users')
                .select()
                .where('Users.email like :email', {email})
                .getOneOrFail();
            return {status: "200", data: user};
        } catch (err) {
            return {status: "400", data: err};
        }
        
    }
    public async checkExistence(username: string, email: string): Promise<Record<string, string | unknown>> {
        try {
            const CheckEmail = await this.createQueryBuilder('Users')
                .select()
                .where('Users.email like :email', {email})
                .getCount();
            const CheckUsername = await this.createQueryBuilder('Users')
                .select()
                .where('Users.username like :username', {username})
                .getCount();
            let response = '';
            let status = "200";
            response += CheckEmail ? 'email' : '';
            response += (CheckEmail + CheckUsername == 2) ? ' and ' : '';
            response += CheckUsername ? 'username' : '';
            response += (CheckEmail + CheckUsername) ? ' is already in use!' : '';
            if (response) status = "406";
            return {status: status, data: response};
        } catch (err) {
            return {status: "500", data: err};
        }
    };

    public async register(user: any): Promise<Record<string, string | object | unknown>> {
        const salt = await this.bcrypt.genSalt(10);
        const hashPassword = await this.bcrypt.hash(user.password, salt);
        const existence = await this.checkExistence(user.username, user.email);
        if (existence.status != "200") {
            return existence;
        }
        try {
            await this.createQueryBuilder('Users')
                .insert()
                .values({
                    email: user.email,
                    username: user.username,
                    password: hashPassword,
                })
                .execute();
            const LoggedUser = await this.login(user);

            return LoggedUser;
        } catch (err) {
            return {status: "500", data: err};
        }
    };

    public async login(data: any): Promise<Record<string, string | object | unknown>> {
        try {
            const user = await this.createQueryBuilder('Users')
                .select()
                .where('LOWER(Users.username) like :data or LOWER(Users.email) like :data',
                    {data: data.username.toLowerCase()})
                .getOne();
            if (!user) return {status: "404", data: 'This user does not exist!'};
            const validPass = await this.bcrypt.compare(data.password, user?.password);
            if (!validPass) return {status: "404", data: 'invalid pair!'};
            const token = await this.jwt.sign({id: user?.id}, 'secret', {expiresIn: '24h'});
            return {status: "200", data: {jwt: token, user: user?.username}};
        } catch (err) {
            return {status: "500", data: err};
        }
    };

    public async auth(data: string): Promise<Record<string, string>> {
        const result = await this.jwt.verify(data, 'secret', (
            err: Error, decoded: Record<string, string>
            ) => {
            if (!err) {
                return {status: "200", data: decoded.id};
            } else {
                return {status: "500", data: err};
            }
        });
        return {status: result.status, data: result.data};
    };

    public async reset(email: string, link: string): Promise<Record<string, unknown>> {
        try {
            const user = await this.checkEmail(email);
            if (user.status == "200") {
                const token = await this.PasswordResetsService.generatePasswordResetToken(email);
                if (token.status == "200") {
                    return await PasswordReset(email, `${user.data.username}`, link+"?token="+token.data);
                } 
                return token;
            }
            return {status: "400", data: "This email does not exist in our database!"};
        } catch (err) {
            return {status: "500", data: err};
        }
    };

    public async changePassword(data: Record<string, string>): Promise<Record<string, string | unknown>> {
        try {
            const email = await this.PasswordResetsService.checkToken(data.token);
            if (email.status == "200") {
                const salt = await this.bcrypt.genSalt(10);
                const hashPassword = await this.bcrypt.hash(data.password, salt);
                await this.createQueryBuilder('Users')
                    .update()
                    .set({
                        password: hashPassword,
                    })
                    .where('email like :email', {email: `${email.data}`})
                    .execute();
                return {status: "200", data: 'Your password has been successfully changed!'};
            }
            else return email;
        } catch (err) {
            return {status: "500", data: err};
        }
    };
}
