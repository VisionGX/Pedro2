import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import MinecraftLog from "./MinecraftLog";
import MinecraftPlayer from "./MinecraftPlayer";
import MinecraftServer from "./MinecraftServer";

@Entity()
export default class MinecraftData {
	@PrimaryColumn({
		type: "varchar",
		length: "20",
	})
		guildId!: string;

	@Column()
		enabled!: boolean;

	@OneToOne(() => MinecraftLog,{
		cascade: true,
		eager: true,
	})
	@JoinColumn()
		log?: MinecraftLog;

	@OneToMany(() => MinecraftServer, server => server.data)
		servers?: MinecraftServer[];

	@OneToMany(() => MinecraftPlayer, player => player.data)
		players?: MinecraftPlayer[];
}