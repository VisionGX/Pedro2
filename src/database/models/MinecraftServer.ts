import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import MinecraftData from "./MinecraftData";
import MinecraftLog from "./MinecraftLog";
import MinecraftPlayer from "./MinecraftPlayer";

@Entity()
export default class MinecraftServer {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column()
		enabled!: boolean;

	@Column({
		unique: true,
		type:"tinytext",
	})
		serverName!: string;
	@Column({
		unique: true,
		type:"longtext",
	})
		identifier!: string;
	@OneToMany(() => MinecraftPlayer, player => player.data,{
		eager: true,
	})
	@JoinColumn()
		players!: MinecraftPlayer[];

	@OneToOne(() => MinecraftData , data => data.servers,{
		eager: false,
	})
	@JoinColumn()
		data!: MinecraftData;
}