import { MessageReaction, User } from "discord.js";
import Bot from "../../Bot";
import GuildSuggestion from "../../database/models/GuildSuggestion";


export default async (client: Bot, reaction:MessageReaction, user:User) => {
	if(user.bot) return;
	if(!reaction.message.guild) return;
	const guildSuggestionRepository = client.database.source.getRepository(GuildSuggestion);
	const guildSuggestion = await guildSuggestionRepository.findOne({
		where: {
			activeMessageId: reaction.message.id
		}
	});
	if(!guildSuggestion) return;
	let count = 0;
	reaction.message.reactions.cache.forEach((reaction) => {
		if(reaction.emoji.name === "✅"){
			count = count + reaction.count;
		}
		else if (reaction.emoji.name === "❌"){
			count = count - reaction.count;
		}
	});
	guildSuggestion.count = count;
	await guildSuggestionRepository.save({...guildSuggestion});
};