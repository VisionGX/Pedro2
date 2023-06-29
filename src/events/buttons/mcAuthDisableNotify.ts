import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { EventExecutor } from "../../types/Executors";

const e: EventExecutor<{ interaction: ButtonInteraction }> = async (client, params) => {
	const { interaction } = params;
	const id = interaction.customId.split("|")[1];
	await interaction.deferUpdate();

	const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
	const mcUser = await mcUserRepo.findOne({
		where: {
			discordUserId: id,
		},
	});
	if (!mcUser) return interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setColor(`#${/*Red*/ 0xFF0000}`)
				.setDescription("This user is not registered in the database."),
		],
	});
	mcUser.notifyOnLogin = false;
	await mcUserRepo.save(mcUser);
	const enableNotifyButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Primary)
		.setLabel("Enable Notifications")
		.setCustomId(`mcAuthEnableNotify|${mcUser.discordUserId}`)
		.setEmoji("🔔");
	const actionRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(enableNotifyButton);

	const embed = new EmbedBuilder()
		.setTitle("Notifications Disabled!")
		.setDescription("You will no longer receive notifications when you login to minecraft.")
		.setColor(`#${client.config.defaultEmbedColor}`);
	if (interaction.message.channel) {
		await interaction.message.edit({
			embeds: [embed],
			components: [actionRow]
		});
	}
	else {
		await interaction.editReply({
			embeds: [embed],
			components: [actionRow]
		});
	}
};
export default e;