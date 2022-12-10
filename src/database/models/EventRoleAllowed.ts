import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class MinecraftPlayer {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column({
		type: "varchar",
		length: "25",
	})
		roleId!: string;	
}