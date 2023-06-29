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
	mcUser.notifyOnLogin = true;
	await mcUserRepo.save(mcUser);
	const disableNotifyButton = new ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel("Disable Notifications")
		.setCustomId(`mcAuthDisableNotify|${mcUser.discordUserId}`)
		.setEmoji("🔕");
	const actionRow = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(disableNotifyButton);

	const embed = new EmbedBuilder()
		.setTitle("Notifications Enabled!")
		.setDescription("You will now receive notifications when you login to minecraft.")
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