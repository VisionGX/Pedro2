import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import MinecraftData from "./MinecraftData";

@Entity()
export default class MinecraftPlayer {
	@PrimaryGeneratedColumn()
		id!: number;


	@Column({
		type: "varchar",
		length: "18",
	})
		userId!: string;
	@Column({
		unique: true,
		type: "tinytext"
	})
		name!: string;

	@Column({
		unique: true,
		nullable: true,
		type: "tinytext"
	})
		uuid?: string;

	@Column({
		nullable: true,
		type: "tinytext"
	})
		lastIp?: string;

	@Column({
		default: false,
	})
		enabled!: boolean;

	@ManyToOne(() => MinecraftData, data => data.players)
		data!: MinecraftData;
}