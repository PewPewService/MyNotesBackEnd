import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('PasswordResets')
export class PasswordResetsEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    token!: string;

    @Column()
    expires!: string;
}