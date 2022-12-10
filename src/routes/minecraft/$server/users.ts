import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "express";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import MinecraftServer from "../../../database/models/MinecraftServer";
import MinecraftServerPlayer from "../../../database/models/MinecraftServerPlayer";
import { ServerRequest } from "../../../types/API";

export default {
	async get(req:ServerRequest, res:Response) {
		const { parentApp: client } = req;
		
		if (!req.headers.authorization) {
			return res.status(403).json({ err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ err: true, code: 403, message: "Invalid authorization!" });

		const server = await client.database.source.getRepository(MinecraftServer).findOne({
			where: {
				identifier: `${req.params.server}`,
			}
		});
		if (!server) return res.status(404).json({ err: true, code: 404, message: "Invalid server identifier!" });
		
		const players = await client.database.source.getRepository(MinecraftServerPlayer).find({
			where: {
				server: server,
			},
			relations: ["player"],
		});
		const users = players.map(p => p.player);

		return res.status(200).json({ err: false, code: 200, message: "Success!", data: users });

		
	},
	async post(req: ServerRequest, res: Response) {
		const { parentApp: client } = req;
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });

	},
};
