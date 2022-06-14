import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class GuildWelcome {
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
	})
	channel?: string;
	@Column({
		nullable: true,
	})
	message?: string;
	@Column({
		nullable: true,
	})
	imageURL?: string;
	@Column({
		nullable: true,
	})
	thumbnail?: string;
	@Column({
		nullable: true,
	})
	footer?: string;
	@Column({
		nullable: true,
	})
	title?: string;
	@Column({
		nullable: true,
	})
	titleURL?: string;
	

	
}