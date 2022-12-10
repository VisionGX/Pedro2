import { ApplicationCommandDataResolvable, Guild } from "discord.js";
import Bot from "../../Bot";

interface CleanInteraction {
	name: string;
	description: string | undefined;
	category: string | null;
	internal_category: string | null;
}

export default async (client: Bot, guild: Guild) => {
	if(!guild){
		const arr:CleanInteraction[] = [];
		for await (const [,interaction] of client.interactions.entries()) {
			if(interaction.type === "SUB_FUNCTION") continue;
			const cleanInt:CleanInteraction = {...interaction};
			cleanInt.description = (interaction.type == "USER" || interaction.type == "MESSAGE") ? undefined : interaction.description;
			cleanInt.category = null;
			if(cleanInt.internal_category == "app")arr.push(cleanInt);
		}
		try {
			client.application?.commands.set(arr as ApplicationCommandDataResolvable[]);
		} catch (e) {
			console.log("Error while updating App Interactions: ", e);
		}
		return;
	}

	const arr:CleanInteraction[] = [];
	for await (const [,interaction] of client.interactions.entries()) {
		if(interaction.type === "SUB_FUNCTION") continue;
		const cleanInt:CleanInteraction = {...interaction};
		cleanInt.description = (interaction.type == "USER" || interaction.type == "MESSAGE") ? undefined : interaction.description;
		cleanInt.category = null;
		if(cleanInt.internal_category == "guild")arr.push(cleanInt);
	}
	try {
		await guild.commands.set(arr as ApplicationCommandDataResolvable[]);
	} catch(e) {
		console.log("Found Guild but couldn't Update Interactions", e);
	}finally {
		console.log("Updated Interactions for", guild.name);
	}
};