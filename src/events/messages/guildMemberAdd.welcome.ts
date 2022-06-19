import { BaseGuildTextChannel, GuildBasedChannel, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import Bot from "../../Bot";
import GuildWelcome from "../../database/models/GuildWelcome";

export default async (client: Bot, member: GuildMember) => {
	const repo = client.database.source.getRepository(GuildWelcome);
	let guildWelcome = await repo.findOne({ where: { guildId: member.guild.id } });
	if (!guildWelcome) {
		guildWelcome = new GuildWelcome();
		guildWelcome.guildId = member.guild.id;
		await repo.save(guildWelcome);
		return;
	}

	const welcomeEmbed = new MessageEmbed();
	if (!guildWelcome.enabled) return;
	if (!guildWelcome.channel) return;

	const { message } = guildWelcome;
	if (!message) return;
	
	// Main content
	if (message.content) welcomeEmbed.setDescription(message.content);
	// Images
	if (message.imageURL) welcomeEmbed.setImage(message.imageURL);
	if (message.thumbnail) welcomeEmbed.setThumbnail(message.thumbnail);
	// Title, TitleURL
	if (message.title) welcomeEmbed.setTitle(message.title);
	if (message.titleURL) welcomeEmbed.setURL(message.titleURL);
	// Footer part of embed
	if(message.footer && message.footerURL){
		welcomeEmbed.setFooter({text:message.footer, iconURL:message.footerURL});
	} else if (message.footer && !message.footerURL) {
		welcomeEmbed.setFooter({ text: message.footer });
	}
	// Author part of embed
	if(message.author && message.authorURL ){
		welcomeEmbed.setAuthor({name:message.author, iconURL:message.authorURL});
	} else if (message.author && !message.authorURL) {
		welcomeEmbed.setAuthor({ name: message.author });
	}

	let channel = member.guild.channels.cache.get(guildWelcome.channel);
	if (!channel) {
		channel = await member.guild.channels.fetch(guildWelcome.channel) ? member.guild.channels.cache.get(guildWelcome.channel) : undefined;
	}
	if (!channel) return;

	if (channel instanceof TextChannel)
		channel.send({ embeds: [welcomeEmbed] });
};