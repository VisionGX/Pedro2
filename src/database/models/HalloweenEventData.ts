import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class HalloweenEventData {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column()
		currentRound!: number;

	@Column()
		rounds!: number;

	@Column()
		playerCount!: number;

	@Column({
		unique: true,
		type: "text",
	})
		guildId!: string;
	
}