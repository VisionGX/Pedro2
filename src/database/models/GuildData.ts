import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import GuildWelcome from "./GuildWelcome";

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

	@OneToOne(() => GuildWelcome)
    @JoinColumn()
	welcome?: GuildWelcome;
}