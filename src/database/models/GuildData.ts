import { Column, Entity, JoinColumn, JoinTable, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import GuildVerify from "./GuildVerify";
import GuildWelcome from "./GuildWelcome";
import GuildMessageEmbed from "./MessageEmbed";

@Entity()
export default class GuildData {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
		guildId!: string;

	@Column({
		nullable: true,
	})
		prefix?: string;

	@Column({
		nullable: true,
	})
		adminRole?: string;

	@Column({
		nullable: true
	})
		modRole?: string;

	@Column({
		nullable: true
	})
		memberRole?: string;

	@Column({
		nullable: true
	})
		logChannel?: string;

	@OneToOne(() => GuildWelcome, {
		nullable: true,
		eager: true,
		orphanedRowAction: "delete",
	})
	@JoinColumn()
		welcome?: GuildWelcome;

	@OneToOne(() => GuildVerify, {
		nullable: true,
		eager: true,
		orphanedRowAction: "delete"
	})
	@JoinColumn()
		verify?: GuildVerify;

	@OneToMany(() => GuildMessageEmbed, (embed) => embed.guildData)
	@JoinTable()
		embeds!: GuildMessageEmbed[];
}