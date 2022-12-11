import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class EventRoleAllowed {
	@PrimaryGeneratedColumn()
		id!: number;

	@Column({
		type: "blob",
	})
		roleIds!: string;	

	@Column({
		type: "varchar",
		length: "25",
	})
		currentRole!: string;
}