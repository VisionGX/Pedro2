import { MessageEmbed } from "discord.js";
import Express from "express";
import { Req } from "../../API";
import Bot from "../../Bot";
import MinecraftData from "../../database/models/MinecraftData";
import { APIFunction } from "../../types/Executors";
import { RequestContainer, ServerInfo } from "../../types/MinecraftPaperAPI";
const fn: APIFunction = {
	name: "Log",
	async execute(client: Bot, req: Req<RequestContainer<ServerInfo>>, res: Express.Response) {
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData = await mcDataRepo.findOne({
			where: {
				serverName: req.body.id,
			},
		});
		if (!mcData) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		if(!mcData.log || !mcData.log.enabled)return;

		const channel = await client.channels.fetch(`${mcData.log.channelId}`);
		if (!channel || !channel.isText()) return;

		const { args, content } = req.body;
		const fields = [];
		for await (const [k, v] of Object.entries(args)) {
			fields.push({ name: k, value: `${v.length >= 1 ? v : "Empty"}` });
		}
		const embed = new MessageEmbed()
			.setTitle("Minecraft Logging")
			.setDescription(`${content}`)
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setFields(fields)
			.setTimestamp(new Date());
		
		await channel.send({
			embeds: [embed],
		});
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	}
};
export default fn;