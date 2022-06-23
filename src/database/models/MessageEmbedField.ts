import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import GuildMessageEmbed from "./MessageEmbed";



@Entity()
export default class MessageEmbedField {
	@PrimaryGeneratedColumn()
		id!: number;
	@Column()
		title!: string;
	
	@Column()
		value!: string;

	@ManyToOne(() => GuildMessageEmbed, embed => embed.fields)
		embed!: GuildMessageEmbed;
}