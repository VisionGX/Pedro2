import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import MinecraftLog from "./MinecraftLog";
import MinecraftPlayer from "./MinecraftPlayer";
import MinecraftServer from "./MinecraftServer";

@Entity()
export default class MinecraftData {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
		guildId!: string;

	@Column()
		enabled!: boolean;

	@OneToOne(() => MinecraftLog,{
		nullable: true,
		eager: true,
	})
	@JoinColumn()
		log?: MinecraftLog;

	@OneToMany(() => MinecraftServer, server => server.data,{
		eager: true,
		nullable: true,
	})
	@JoinColumn()
		servers!: MinecraftServer[];

	@OneToMany(() => MinecraftPlayer, player => player.data,{
		eager: true,
		nullable: true,
	})
	@JoinColumn()
		players!: MinecraftPlayer[];
}