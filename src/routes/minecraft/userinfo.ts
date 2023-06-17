import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { ServerRequest } from "../../types/API";
import { Response } from "express";

export default {
	async get(req: ServerRequest, res: Response) {
		const sessionCookie = req.cookies?.session;
		if (!sessionCookie) {
			res.status(400).send("No session cookie provided");
			return;
		}
		const userRepo = req.parentApp.database.source.getRepository(MinecraftPlayer);
		const player = await userRepo.findOne({
			where: {
				sessionCookie: sessionCookie
			}
		});
		if (!player) {
			res.status(400).send("No player found with that session cookie");
			return;
		}
		const { discordUserId } = player;
		const discordUser = await req.parentApp.users.fetch(discordUserId);
		if (!discordUser) {
			res.status(404).send("No user found with that ID");
			return;
		}
		res.json({
			discord: {
				id: discordUser.id,
				username: discordUser.username,
				discriminator: discordUser.discriminator,
				avatarURL: discordUser.avatarURL({
					size: 2048,
					extension: "png",
				}),
			},
			minecraft: {
				username: player.username,
				uuid: player.uuid,
				status: player.enabled ? "enabled" : "disabled",
			},
		});
	},
}