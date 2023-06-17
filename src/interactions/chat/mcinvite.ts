import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "../../Bot";
import { Interaction } from "../../types/Executors";
import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { createBaseMinecraftUser } from "../../util/MinecraftFunctions";

const MAX_INVITES = 2;

const interaction: Interaction = {
	name: "minecraft_invite",
	type: ApplicationCommandType.ChatInput,
	description: "Invita a alguien al servidor de Minecraft!",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "user",
			description: "El usuario al que quieres invitar.",
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser("user", true);
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);

		const mcUser = await mcUserRepo.findOne({
			where: {
				discordUserId: interaction.user.id
			},
		});

		if (!mcUser) return interaction.reply("Aún no te has registrado, registrate y vuelve a intentarlo.");
		if (!mcUser.username) return interaction.reply("Tu registro aún no ha sido completado, completa tu registro y vuelve a intentarlo.");
		if (mcUser.getInvitedPlayers().length >= MAX_INVITES && !client.config.admins.includes(mcUser.discordUserId)
		) return interaction.reply("Has alcanzado el máximo de invitaciones.");


		const mcInvitedUser = await mcUserRepo.findOne({
			where: {
				discordUserId: user.id
			},
		}) || await createBaseMinecraftUser(user.id);

		if (mcInvitedUser.invitedBy) return interaction.reply("Este usuario ya ha sido invitado por alguien más.");

		mcInvitedUser.invitedBy = mcUser.discordUserId;
		mcInvitedUser.enabled = true;
		mcUser.addInvitedPlayer(mcInvitedUser.discordUserId);

		await mcUserRepo.save(mcInvitedUser);
		await mcUserRepo.save(mcUser);

		const embed = new EmbedBuilder()
			.setTitle("Invitación exitosa")
			.setDescription(`Has invitado a ${user.username} a Minecraft.\n Ahora tiene acceso a los servidores que tú tengas acceso.`)
			.setColor("#00ff00")

		await interaction.reply({
			embeds: [embed]
		});
	}
};
export default interaction;