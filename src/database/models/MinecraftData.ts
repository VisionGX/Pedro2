import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import MinecraftLog from "./MinecraftLog";
import MinecraftPlayer from "./MinecraftPlayer";

@Entity()
export default class MinecraftData {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
		guildId!: string;

	@Column()
		enabled!: boolean;

	@Column({
		unique: true,
		type:"tinytext",
	})
		serverName!: string;


	@OneToOne(() => MinecraftLog,{
		nullable: true,
		eager: true,
	})
	@JoinColumn()
		log?: MinecraftLog;

	@OneToMany(() => MinecraftPlayer, player => player.data,{
		eager: true,
	})
	@JoinColumn()
		players!: MinecraftPlayer[];
}