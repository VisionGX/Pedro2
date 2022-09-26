import { ButtonInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import MinecraftPlayer from "../../database/models/MinecraftPlayer";

export default async (client: Bot, interaction: ButtonInteraction) => {
	const id = interaction.customId.split("|")[1];
	interaction.deferUpdate();

	const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
	const mcUser = await mcUserRepo.findOne({
		where: {
			uuid: id,
		},
	});
	if (!mcUser) return interaction.editReply({
		embeds: [
			new MessageEmbed()
				.setColor("RED")
				.setDescription("This user is not registered in the database."),
		],
	});
	const mcData = mcUser.data;

	if (!mcData) return client.logger.error("Minecraft data not found");
	const players = await mcUserRepo.find();
	if (!players) return client.logger.error("Minecraft players not found");
	const player = players.find(p => p.uuid === id);
	if (!player) return client.logger.warn(`Could not find user with uuid ${id} in database`);

	await mcUserRepo.save({
		...player,
		enabled: true
	});
	const embed = new MessageEmbed()
		.setTitle("Authorized!")
		.setDescription("Your new IP has been authorized.\nYou can now Login")
		.setColor(`#${client.config.defaultEmbedColor}`);
	await interaction.channel?.send({
		embeds: [embed],
	}).catch(() => null);

	if (interaction.message.type == "DEFAULT") {
		await interaction.message.delete().catch(() => null);
	}
};