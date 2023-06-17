import { ButtonInteraction, EmbedBuilder } from "discord.js";
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
	mcUser.enabled = true;
	await mcUserRepo.save(mcUser);
	const embed = new EmbedBuilder()
		.setTitle("Authorized!")
		.setDescription("Your new IP has been authorized.\nYou can now Login")
		.setColor(`#${client.config.defaultEmbedColor}`);
	if (interaction.message.channel) {
		await interaction.message.edit({
			embeds: [embed],
			components: []
		});
	}
	else {
		await interaction.editReply({
			embeds: [embed],
			components: []
		});
	}
};
export default e;