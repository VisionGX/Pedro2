import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import MessageEmbed from "./MessageEmbed";

@Entity()
export default class GuildVerify {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
	guildId!: string;

	@Column({
		nullable: true,
	})
	enabled?: boolean;
	
	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
	channel?: string;

	@OneToOne(() => MessageEmbed)
	@JoinColumn()
	message?: MessageEmbed;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
	verifyRole?: string;
	
}