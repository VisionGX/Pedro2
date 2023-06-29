import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class MinecraftPlayer {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({
		nullable: true,
		unique: true,
		type: "text"
	})
	username?: string;

	@Column({
		unique: true,
		nullable: true,
		type: "text",
	})
	uuid?: string;

	@Column({
		unique: true,
		type: "varchar",
		length: "20",
	})
	discordUserId!: string;

	@Column({
		nullable: true,
		type: "text",
	})
	lastIp?: string;

	@Column({
		default: false,
	})
	enabled!: boolean;

	@Column({
		default:true,
	})
	notifyOnLogin!: boolean;

	@Column({
		nullable: true,
		type: "text",
	})
	sessionCookie?: string;

}