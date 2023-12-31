import { EmbedBuilder, Message, TextBasedChannel } from "discord.js";
import GuildMessageEmbed from "../database/models/MessageEmbed";

function buildEmbedFrom(dbembed: GuildMessageEmbed): EmbedBuilder {

	const embed = new EmbedBuilder();

	if (dbembed.title && dbembed.title !== "") embed.setTitle(dbembed.title);
	if (dbembed.titleURL && dbembed.titleURL !== "") embed.setURL(dbembed.titleURL);
	if (dbembed.description && dbembed.description !== "") embed.setDescription(dbembed.description);
	if (dbembed.imageURL && dbembed.imageURL !== "") embed.setImage(dbembed.imageURL);
	if (dbembed.thumbnailURL && dbembed.thumbnailURL !== "") embed.setThumbnail(dbembed.thumbnailURL);
	if ((dbembed.footer && dbembed.footer !== "") && (dbembed.footerURL && dbembed.footerURL !== "")) {
		embed.setFooter({ text: dbembed.footer, iconURL: dbembed.footerURL });
	} else if (dbembed.footer) {
		embed.setFooter({ text: dbembed.footer });
	}
	if ((dbembed.author && dbembed.author !== "") && (dbembed.authorURL && dbembed.authorURL !== "")) {
		embed.setAuthor({ name: dbembed.author, iconURL: dbembed.authorURL });
	} else if (dbembed.author && dbembed.authorURL !== "") {
		embed.setAuthor({ name: dbembed.author });
	}
	for (let i = 0; (i < dbembed.fields.length && i < 25); i++) {
		embed.addFields({ name: dbembed.fields[i].title, value: dbembed.fields[i].value });
	}
	if (dbembed.color && dbembed.color !== "") embed.setColor(`#${dbembed.color}`);
	return embed;
}

async function createOrEditMessage(channel: TextBasedChannel, embed: EmbedBuilder, messageId?: string): Promise<Message | null> {
	if (!messageId) {
		const newMessage = await channel.send({
			embeds: [embed]
		}).catch(() => null);
		return newMessage;
	} else {
		const lastMessage = channel.messages.cache.get(messageId) || await channel.messages.fetch(messageId).catch(() => null);
		if (!lastMessage) {
			const newMessage = await channel.send({
				embeds: [embed]
			}).catch(() => null);
			return newMessage;
		}
		else {
			const msg = await lastMessage.edit({
				embeds: [embed]
			}).catch(() => null);
			return msg;
		}
	}
}

export { buildEmbedFrom, createOrEditMessage };