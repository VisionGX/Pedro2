import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import GuildMessageEmbed from "./MessageEmbed";

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

	@Column({
		nullable: true,
		type: "varchar",
		length: "80",
		default: "Verify",
	})
		label?: string;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
		default: "white_check_mark",
	})
		emoji?: string;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
		verifyRole?: string;

	@OneToOne(() => GuildMessageEmbed, {
		eager: true
	})
	@JoinColumn()
		message?: GuildMessageEmbed;

}