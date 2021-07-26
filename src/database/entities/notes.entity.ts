/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('Notes')
export class NotesEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @Column('text', {nullable: true})
    text!: string;

    @Column('text', {array: true, nullable: true})
    images!: string[];

    @Column('text', {array: true, nullable: true})
    tags!: string

    @Column()
    userId!: number;

    @Column()
    pinned!: boolean;

  // @Column('timestamp', {nullable: true})
  // timestamp!: Date
}
