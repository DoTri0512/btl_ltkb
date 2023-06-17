import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn, ManyToOne,OneToMany, JoinColumn  } from "typeorm"
import { TradeMark } from "./Trademark"
import { Order } from "./Order"
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    description: string
    @Column()
    gender: string
    // @Column()
    // trademark: string
    @Column()
    image: string
    @Column("double")
    price: number
    @ManyToOne((type) => TradeMark)
    @JoinColumn({name: "trademark_id"})
    trademark: TradeMark
    @OneToMany(() => Order, (product) => product.id)
    order: Order[]
}