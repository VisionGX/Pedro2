import Bot from "../../Bot";
import GuildSuggestion from "../../database/models/GuildSuggestion";


export default async (client: Bot) => {
	const guildSuggestionRepository = client.database.source.getRepository(GuildSuggestion);
	const guildSuggestions = await guildSuggestionRepository.find({relations: ["config"]});
	for await (const guildSuggestion of guildSuggestions) {
		if(!guildSuggestion.activeMessageId) continue;
		const channel = client.channels.cache.get(`${guildSuggestion.config.publicChannel}`);
		if(!channel || !channel.isText()) continue;
		const message = await channel.messages.fetch(guildSuggestion.activeMessageId).catch(() => {
			client.logger.warn(`Message ${guildSuggestion.activeMessageId} not found when sending suggestion`);
		});

		if(!message) continue;
		let count = 0;
		message.reactions.cache.forEach((reaction) => {
			if(reaction.emoji.name === "✅"){
				count = count + reaction.count;
			}
			else if (reaction.emoji.name === "❌"){
				count = count - reaction.count;
			}
		});
		guildSuggestion.count = count;
		client.logger.info(`Suggestion ${guildSuggestion.id} has ${count} votes now`);
		await guildSuggestionRepository.save({...guildSuggestion});
	}
};