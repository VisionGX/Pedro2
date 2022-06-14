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

	if (guildWelcome.message) welcomeEmbed.setDescription(guildWelcome.message);
	if (guildWelcome.imageURL) welcomeEmbed.setImage(guildWelcome.imageURL);
	if (guildWelcome.thumbnail) welcomeEmbed.setThumbnail(guildWelcome.thumbnail);
	if (guildWelcome.footer) welcomeEmbed.setFooter({ text: guildWelcome.footer });
	if (guildWelcome.title) welcomeEmbed.setTitle(guildWelcome.title);
	if (guildWelcome.titleURL) welcomeEmbed.setURL(guildWelcome.titleURL);

	let channel = member.guild.channels.cache.get(guildWelcome.channel);
	if (!channel) {
		channel = await member.guild.channels.fetch(guildWelcome.channel) ? member.guild.channels.cache.get(guildWelcome.channel) : undefined;
	}
	if (!channel) return;

	if (channel instanceof TextChannel)
		channel.send({ embeds: [welcomeEmbed] });
};