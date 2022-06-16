import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class MessageEmbed {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: true })
	content?: string;

	@Column({ nullable: true })
	imageURL?: string;

	@Column({ nullable: true })
	thumbnail?: string;

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



}