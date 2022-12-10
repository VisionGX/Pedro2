import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import MinecraftData from "./MinecraftData";
import MinecraftServerPlayer from "./MinecraftServerPlayer";

@Entity()
export default class MinecraftServer {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column({
		unique: true,
		type:"text",
	})
		serverName!: string;
	@Column({
		unique: true,
		type:"text",
	})
		identifier!: string;

	@ManyToOne(() => MinecraftData , data => data.servers,{
		eager: true,
		cascade: true,
	})
		data?: MinecraftData;

	@OneToMany(() => MinecraftServerPlayer, serverplayer => serverplayer.server,{
		eager:true,
		cascade:true
	})
		players!: MinecraftServerPlayer[];
}