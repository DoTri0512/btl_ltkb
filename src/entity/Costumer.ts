import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn, OneToMany  } from "typeorm"
import { Order } from "./Order"
@Entity()
export class Costumer {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    phone: number
    @Column()
    address: string
    @OneToMany(() => Order, (order) => order.id)
    order: Order[]
}