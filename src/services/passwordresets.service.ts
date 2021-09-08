import { getConnection } from "typeorm";
import { PasswordResetsRepository } from "../repository/passwordresets.repository";

export class PasswordResetsService {
    private PasswordResetsRepository: PasswordResetsRepository;

    constructor() {
        this.PasswordResetsRepository = 
            getConnection('MyNotes').getCustomRepository(PasswordResetsRepository);
    };

    public async generatePasswordResetToken(email: string): Promise<Record<string, string | unknown>> {
        const result = await this.PasswordResetsRepository.generatePasswordReset(email);
        return result;
    };

    public async checkToken(token: string): Promise<Record<string, string | number>> {
        const result = await this.PasswordResetsRepository.checkToken(token);
        return result;
    };
}