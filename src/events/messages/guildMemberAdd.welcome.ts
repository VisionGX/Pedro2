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

	if (message.content) welcomeEmbed.setDescription(message.content);
	if (message.imageURL) welcomeEmbed.setImage(message.imageURL);
	if (message.thumbnail) welcomeEmbed.setThumbnail(message.thumbnail);
	if (message.footer) welcomeEmbed.setFooter({ text: message.footer });
	if (message.title) welcomeEmbed.setTitle(message.title);
	if (message.titleURL) welcomeEmbed.setURL(message.titleURL);

	let channel = member.guild.channels.cache.get(guildWelcome.channel);
	if (!channel) {
		channel = await member.guild.channels.fetch(guildWelcome.channel) ? member.guild.channels.cache.get(guildWelcome.channel) : undefined;
	}
	if (!channel) return;

	if (channel instanceof TextChannel)
		channel.send({ embeds: [welcomeEmbed] });
};