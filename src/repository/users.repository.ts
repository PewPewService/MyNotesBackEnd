/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {EntityRepository, Repository} from 'typeorm';
import {UsersEntity} from '../database/entities/users.entity';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
    public bcrypt = require('bcryptjs');
    public jwt = require('jsonwebtoken');


    public async checkExistence(username: string, email: string) {
      try {
        const CheckEmail = await this.createQueryBuilder('Users')
            .select()
            .where('Users.email like :email', {email: email})
            .getCount();
        const CheckUsername = await this.createQueryBuilder('Users')
            .select()
            .where('Users.username like :username', {username: username})
            .getCount();
        let response = '';
        let status = 200;
        response += CheckEmail ? 'email' : '';
        response += (CheckEmail+CheckUsername==2) ? ' and ' : '';
        response += CheckUsername ? 'username' : '';
        response += (CheckEmail+CheckUsername) ? ' is already in use!' : '';
        if (response) status = 250;
        return {status: status, data: response};
      } catch (err) {
        return {status: 250, data: err};
      }
    }

    public async register(user: any) {
      const salt = await this.bcrypt.genSalt(10);
      const hasPassword = await this.bcrypt.hash(user.password, salt);
      const existence = await this.checkExistence(user.username, user.email);
      if (existence.status != 200) {
        return existence;
      }
      try {
        await this.createQueryBuilder('Users')
            .insert()
            .values({
              email: user.email,
              username: user.username,
              password: hasPassword,
            })
            .execute();
        const LoggedUser = await this.login(user);

        return {status: 200, data: LoggedUser};
      } catch (err) {
        return {status: 250, data: err};
      }
    }

    public async login(data: any) {
      try {
        const user = await this.createQueryBuilder('Users')
            .select()
            .where('LOWER(Users.username) like :data or LOWER(Users.email) like :data',
                {data: data.username.toLowerCase()})
            .getOne();
        if (!user) return {status: 240, data: 'This user does not exist!'};
        const validPass = await this.bcrypt.compare(data.password, user?.password);
        if (!validPass) return {status: 240, data: 'invalid pair!'};
        const token = await this.jwt.sign({id: user?.id}, 'secret', {expiresIn: '24h'});
        return {status: 200, data: {jwt: token, user: user?.username}};
      } catch (err) {
        return {status: 250, data: err};
      }
    }

    public async auth(data: any) {
      const result = await this.jwt.verify(data, 'secret', (err: any, decoded: any) =>{
        if (!err) {
          return {status: 200, data: decoded.id};
        } else return {status: 250, data: err};
      });
      return {status: result.status, data: result.data};
    }
}
