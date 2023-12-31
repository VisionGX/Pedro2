import { GeneralContent, HandlerFunction } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";
import { EmbedBuilder } from "discord.js";
import MinecraftLog from "../../../database/models/MinecraftLog";

const handler: Handler<HandlerFunction<Bot, "PlayerLeave">> = {
	type: "PlayerLeave",
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
			.setTitle(`Player ${data.body.args.player.name} left the server!`)
			.setDescription(data.body.content || "No content")
			.setTimestamp()
			.setColor(`#${client.config.defaultEmbedColor}`);

		for await (const [key, arg] of Object.entries(data.body.args.player)) {
			if (key === "ip") continue;
			embed.addFields({
				name: key,
				value: arg,
			});
		}

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