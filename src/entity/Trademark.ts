import { Entity, Column, PrimaryColumn,PrimaryGeneratedColumn, OneToMany  } from "typeorm"
import { Product } from "./Product"
@Entity()
export class TradeMark {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @OneToMany(() => Product, (product) => product.trademark)
    product: Product[]
}