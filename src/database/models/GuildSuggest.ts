import { Column, Entity, JoinTable, OneToMany, PrimaryColumn } from "typeorm";
import GuildSuggestion from "./GuildSuggestion";

@Entity()
export default class GuildSuggest {
	@PrimaryColumn({
		type: "varchar",
		length: "18",
	})
		guildId!: string;

	@Column({
		default: false,
	})
		enabled?: boolean;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
		publicChannel?: string;

	@Column({
		nullable: true,
		type: "varchar",
		length: "18",
	})
		privateChannel?: string;

	@OneToMany(() => GuildSuggestion, suggestion => suggestion.config, {
		eager: true,
		orphanedRowAction: "delete",
	})
	@JoinTable()
		suggestions!: GuildSuggestion[];

}