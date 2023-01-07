import { EmbedBuilder } from "discord.js";
import { EventExecutor } from "../../types/Executors";

const e: EventExecutor<never> = async (client) => {
	const channelId = process.env.TWITCH_STREAM_STARTED_CHANNEL_ID;
	if (!channelId) return client.logger.error("Twitch Stream Started Channel ID not found");
	const channel = await client.channels.fetch(channelId);
	if (!channel) return client.logger.error("Twitch Stream Started Channel not found");
	if (!channel.isTextBased()) return client.logger.error("Twitch Stream Started Channel is not a text channel");
	const embed = new EmbedBuilder()
		.setTitle(process.env.TWITCH_STREAM_STARTED_TITLE?.replace("#", " ") || "Stream Started")
		.setTimestamp(new Date())
		.setColor(`#${client.config.defaultEmbedColor}`);
	await channel.send({
		content: `https://twitch.tv/${process.env.TWITCH_USERNAME?.replace("#", " ")}`,
		embeds: [embed],
	});
};
export default e;