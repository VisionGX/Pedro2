import { ButtonInteraction, GuildMember, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import GuildVerify from "../../database/models/GuildVerify";

export default async (client: Bot, interaction: ButtonInteraction) => {
	try {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!verify) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Verificaton not found")
					.setDescription("Please contact the bot's administrator.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		if (!verify.verifyRole) return;
		await interaction.deferUpdate();
		if (!(interaction.member instanceof GuildMember)) return;

		await interaction.member.roles.add(verify.verifyRole);
	} catch (e) {
		client.logger.error("Error in buttonVerify.ts", e);
	}
};