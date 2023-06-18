import { GeneralContent, HandlerFunction } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";
import { EmbedBuilder } from "discord.js";
import MinecraftLog from "../../../database/models/MinecraftLog";

const handler: Handler<HandlerFunction<Bot, "Log">> = {
	type: "Log",
	run: async (client, data) => {
		const mcLogRepo = client.database.source.getRepository(MinecraftLog);

		const log = await mcLogRepo.findOne({ where: { serverIdentifier: data.body.id } });

		if (!log) {
			return {
				body: data.body,
				err: false,
				code: 200,
				message: "Received!"
			};
		}

		const guildId = log.guildId;
		const channelId = log.channelId;

		if (!guildId || !channelId) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Server not found!"
			};
		}
		const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
		if (!guild) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Guild not found!"
			};
		}
		const channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
		if (!channel || !channel.isTextBased()) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Channel not found!"
			};
		}

		const embed = new EmbedBuilder()
			.setTitle(`Minecraft Server Log`)
			.setDescription(data.body.content || "No content")
			.setTimestamp()
			.setColor(`#${client.config.defaultEmbedColor}`);

		embed.addFields([
			{ name: "Server Name", value: `${data.body.args.serverName || "Not Received"}` },
			{ name: "Server Version", value: `${data.body.args.serverVersion || "Not Received"}` },
			{ name: "Server MOTD", value: `${data.body.args.serverMotd || "Not Received"}` },
			{ name: "Server Max Players", value: `${data.body.args.serverMaxPlayers || "Not Received"}` },
			{ name: "Server IP", value: `${data.body.args.serverIP || "Not Received"}` },
			{ name: "Server Port", value: `${data.body.args.serverPort || "Not Received"}` },
			{ name: "Plugin Version", value: `${data.body.args.pluginVersion || "Not Received"}` }
		]);

		channel.send({ embeds: [embed] });

		return {
			body: data.body,
			err: false,
			code: 200,
			message: "Received!"
		};
	}
}
export default handler;