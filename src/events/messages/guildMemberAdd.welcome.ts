import { GuildMember, TextChannel } from "discord.js";
import Bot from "../../Bot";
import GuildWelcome from "../../database/models/GuildWelcome";
import { buildEmbedFrom } from "../../util/Functions";

export default async (client: Bot, member: GuildMember) => {
	const repo = client.database.source.getRepository(GuildWelcome);
	let guildWelcome = await repo.findOne({ where: { guildId: member.guild.id } });
	if (!guildWelcome) {
		guildWelcome = new GuildWelcome();
		guildWelcome.guildId = member.guild.id;
		await repo.save(guildWelcome);
		return;
	}
	if (!guildWelcome.enabled) return;
	if (!guildWelcome.channel) return;

	const { message } = guildWelcome;
	if (!message) return;

	const welcomeEmbed = buildEmbedFrom(message);

	let channel = member.guild.channels.cache.get(guildWelcome.channel);
	if (!channel) {
		channel = await member.guild.channels.fetch(guildWelcome.channel) ? member.guild.channels.cache.get(guildWelcome.channel) : undefined;
	}
	if (!channel) return;

	if (channel instanceof TextChannel)
		channel.send({ embeds: [welcomeEmbed] });
};