import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import MinecraftPlayer from "./MinecraftPlayer";
import MinecraftServer from "./MinecraftServer";

@Entity()
export default class MinecraftServerPlayer {
	@PrimaryGeneratedColumn()
		id!: number;

	@ManyToOne(() => MinecraftPlayer, player => player.servers,{
		nullable: false,
	})
		player!: MinecraftPlayer;

	@ManyToOne(()=> MinecraftServer, server => server.players,{
		nullable: false,
	})
		server!: MinecraftServer;
}