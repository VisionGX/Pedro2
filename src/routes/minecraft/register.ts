import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { ServerRequest } from "@src/types/API";
import { Response } from "express";

export default {
	async get(req: ServerRequest, res: Response) {
		const oauth2Url = `https://discord.com/api/oauth2/authorize?client_id=${req.parentApp.application?.id}&redirect_uri=${encodeURIComponent("https://" + req.hostname + "/minecraft/oauthcallback")}&response_type=code&scope=identify`;
		res.redirect(oauth2Url);
	},
	async post(req: ServerRequest, res: Response) {
		const sessionCookie = req.cookies?.session;
		if (!sessionCookie) {
			res.redirect("/minecraft/register");
			return;
		}
		const userRepo = req.parentApp.database.source.getRepository(MinecraftPlayer);
		const player = await userRepo.findOne({
			where: {
				sessionCookie: sessionCookie
			}
		});
		if (!player) {
			res.redirect("/minecraft/register");
			return;
		}
		const { discordUserId } = player;
		const discordUser = await req.parentApp.users.fetch(discordUserId);
		if (!discordUser) {
			res.redirect("/minecraft/register");
			return;
		}
		if (player.username) {
			res.redirect("/minecraftjoined.html");
			req.parentApp.logger.warn(`User ${discordUser.username}#${discordUser.discriminator} (${discordUser.id}) tried to register a username but already has one`);
			return;
		}
		const { username } = req.body;
		if (!username) {
			res.redirect("/minecraftjoining.html?error=No username provided");
			return;
		}
		userRepo.save({
			...player,
			username: username
		});
		req.parentApp.logger.debug(`User ${discordUser.username}#${discordUser.discriminator} (${discordUser.id}) has registered the username ${username}`);

		res.redirect("/minecraftjoined.html");
	}
}