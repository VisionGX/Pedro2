import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GuildData from "./GuildData";
import MessageEmbedField from "./MessageEmbedField";

@Entity()
export default class GuildMessageEmbed {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column({
		unique: true,
	})
		name!: string;

	@Column({ nullable: true })
		description?: string;

	@Column({ nullable: true })
		imageURL?: string;

	@Column({ nullable: true })
		thumbnailURL?: string;

	@Column({ nullable: true })
		footer?: string;

	@Column({ nullable: true })
		footerURL?: string;

	@Column({ nullable: true })
		title?: string;

	@Column({ nullable: true })
		titleURL?: string;

	@Column({ nullable: true })
		author?: string;

	@Column({ nullable: true })
		authorURL?: string;

	@Column({ nullable: true })
		color?: string;

	@OneToMany(() => MessageEmbedField, field => field.embed, {
		eager: true,
		orphanedRowAction: "delete",
	})
	@JoinTable()
		fields!: MessageEmbedField[];

	@ManyToOne(() => GuildData)
		guildData!: GuildData;
}