import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "express";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { ServerRequest } from "../../../types/API";

export default {
	async get(req:ServerRequest, res:Response) {
		const { parentApp: client } = req;
		
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });

		const users = await client.database.source.getRepository(MinecraftPlayer).find();
		const server = await client.database.source.getRepository(MinecraftServer).findOne({
			where: {
				identifier: `${req.body.id}`,
			}
		});
		if (!server) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server identifier!" });
		
		// Match users to server
		const serverUsers = users.filter(u => u.servers.some(sp => sp.server.identifier === server.identifier));
		
		return res.status(200).json({ body: req.body, err: false, code: 200, message: "Success!", data: serverUsers });

		
	},
	async post(req: ServerRequest, res: Response) {
		const { parentApp: client } = req;
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });

	},
};
