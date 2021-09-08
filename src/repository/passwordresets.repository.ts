import { EntityRepository, Repository } from "typeorm";
import { PasswordResetsEntity } from "../database/entities/passwordresets.entity";
import { randomBytes } from 'crypto';

@EntityRepository(PasswordResetsEntity)
export class PasswordResetsRepository extends Repository<PasswordResetsEntity> {
    public async generatePasswordReset(email: string): Promise<Record<string, string | unknown>> {
        try {
            const token = randomBytes(30).toString('hex');
            await this.createQueryBuilder('PasswordResets')
                .insert()
                .values({
                    email: email,
                    token: token,
                    expires: `${Date.now()+3600000}`,
                })
                .execute();
            return {status: '200', data: token};
        } catch (err) {
            console.log(err);
            return {status: '500', data: err};
        }
    };

    public async checkToken(token: string): Promise<Record<string, string | number>> {
        let status = 410;
        let data = 'Your token has expired, create new again!';
        try {
            const time = await this.createQueryBuilder('PasswordResets')
                .select()
                .where('PasswordResets.token like :token', { token })
                .getOneOrFail();
            if (Number(time.expires) > Date.now()) {
                status = 200;
                data = time.email;
            }
        } catch (err) {
            status = 400;
            data = 'Token is invalid, create a new one!';
        } finally {
            return {status, data};
        }
    };
}