import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import MinecraftData from "./MinecraftData";
import MinecraftServer from "./MinecraftServer";
import MinecraftServerPlayer from "./MinecraftServerPlayer";

@Entity()
export default class MinecraftPlayer {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column({
		type: "varchar",
		length: "20",
	})
		userId!: string;
	@Column({
		unique: true,
		type: "text"
	})
		name!: string;

	@Column({
		unique: true,
		nullable: true,
		type: "text",
	})
		uuid?: string;

	@Column({
		nullable: true,
		type: "text"
	})
		type?: string;
	
	@Column({
		nullable: true,
		type: "longtext"
	})
		customProperties?: string;

	@Column({
		nullable: true,
		type: "text",
	})
		lastIp?: string;

	@Column({
		default: false,
	})
		enabled!: boolean;

	@ManyToOne(() => MinecraftData, data => data.players,{
		eager: true,
		cascade: true,
	})
		data!: MinecraftData;

	@OneToMany(() => MinecraftServerPlayer, serverplayer => serverplayer.player,{
		eager:true,
		cascade:true
	})
		servers!: MinecraftServerPlayer[];
}