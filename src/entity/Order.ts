import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn  } from "typeorm"
import { Product } from "./Product"
import { Costumer } from "./Costumer"
@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number
    @Column("int")
    amount: number
    @Column("double")
    price: number
    @Column()
    date_create: Date
    @ManyToOne((type) => Product)
    @JoinColumn({name: "pro_id"})
    product: Product
    @ManyToOne((type) => Costumer)
    @JoinColumn({name: "costumer_id"})
    costumer: Costumer
}