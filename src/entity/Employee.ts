import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn } from "typeorm"
@Entity()
export class Employess {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    email: string
    @Column()
    address: string
    @Column()
    phone: number
}