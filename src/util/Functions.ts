import { MessageEmbed } from "discord.js";
import GuildMessageEmbed from "../database/models/MessageEmbed";

function buildEmbedFrom(dbembed: GuildMessageEmbed): MessageEmbed {

	const embed = new MessageEmbed();

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
		embed.addField(dbembed.fields[i].title, dbembed.fields[i].value);
	}
	return embed;
}

export { buildEmbedFrom };