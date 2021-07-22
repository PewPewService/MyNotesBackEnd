import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;
}