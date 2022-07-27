import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import MinecraftData from "./MinecraftData";

@Entity()
export default class MinecraftLog {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
		guildId!: string;

	@Column()
		enabled!: boolean;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
		channelId?: string;


	@OneToOne(() => MinecraftData)
		data!: MinecraftData;
}