import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildVerify from "../../../database/models/GuildVerify";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "verify role",
	type: "SUB_FUNCTION",
	description: "Configure the verify member role.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!verify) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Verify Message not found")
					.setDescription("Please enable the verify message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const role = interaction.options.getRole("verified_role");
		if(!role) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No role provided")
					.setDescription("Please provide a role to assign to verified members.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.verifyRole = role.id;
		await verifyRepo.save(verify);

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Verify role updated")
					.setDescription(`The verify role has been updated to ${role}.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;