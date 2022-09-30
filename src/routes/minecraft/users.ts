import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "express";
import { ServerRequest } from "../../types/API";

export default {
	async get(req:ServerRequest, res:Response) {
		const { parentApp: client } = req;
		
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		
	},
	async post(req: ServerRequest, res: Response) {
		const { parentApp: client } = req;
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid authorization!" });

	},
};
