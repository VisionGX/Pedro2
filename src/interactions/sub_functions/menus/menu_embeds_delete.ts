import { Message, MessageEmbed, SelectMenuInteraction } from "discord.js";
import Bot from "../../../Bot";
import GuildMessageEmbed from "../../../database/models/MessageEmbed";
import { Interaction } from "../../../types/Executors";
const interaction: Interaction = {
	name: "menu embeds delete",
	type: "SUB_FUNCTION",
	description: "Delete an embed, as a menu option.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const id = interaction.values[0];
		if(!id) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to delete.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { id:parseInt(id) } });
		if(!embed) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Embed not found")
					.setDescription("Please select an embed to delete.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		await embedRepo.remove(embed);
		
		if (interaction.isMessageComponent() && interaction.message instanceof Message){
			interaction.message.deletable ? await interaction.message.delete() : null;
		}
		
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Embed deleted")
					.setDescription("The embed has been deleted.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;