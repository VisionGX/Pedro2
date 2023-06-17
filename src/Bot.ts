/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command, Interaction, Job } from "./types/Executors";
import Schedule from "node-schedule";
import SPDatabase from "./database";
import { Log } from "./util/Logger";
import { BotConfig } from "./types/Config";
import API from "./API";
import { JSONPackage } from "./types/JSONPackage";
import CLI from "./cli/CLI";
import findRecursive from "@spaceproject/findrecursive";
import { Orizuru, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import { Handler } from "./types/Handler";

const nonPrivilegedIntents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildIntegrations,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.GuildScheduledEvents
];
const privilegedIntents = [
	GatewayIntentBits.MessageContent
];
let intents: GatewayIntentBits[] = [];
class Bot extends Client {
	logger: Log.Logger;
	readonly config: BotConfig;
	commands: Collection<string, Command>;
	interactions: Collection<string, Interaction>;
	jobs: Collection<string, Job>;
	readonly database: SPDatabase;
	readonly server: API;
	readonly commandline: CLI;
	readonly package: JSONPackage;
	// Non-Standard Clients
	clients: {
		orizuru: Orizuru
	};
	constructor() {
		if (process.env.NODE_ENV === "development") {
			intents = nonPrivilegedIntents.concat(privilegedIntents);
		}
		else {
			intents = nonPrivilegedIntents;
		}
		super({
			intents
		});
		this.logger = new Log.Logger();
		this.commands = new Collection();
		this.interactions = new Collection();
		this.jobs = new Collection();
		this.config = require("../config");
		this.database = new SPDatabase(this.config.database);
		this.server = new API(this);
		this.commandline = new CLI(this, process.stdin, process.stdout);
		this.package = require("../package.json");
		// Non-Standard Clients
		this.clients = {
			orizuru: new Orizuru(this, {
				reqAuthValidator: (req) => {
					const authHeader = req.headers.authorization;
					if (!authHeader) return false;
					if (authHeader !== this.config.api.password) return false;
					return true;
				},
			}),
		};
	}
	async registerEvents() {
		const events = await findRecursive(`${__dirname}/events`);
		for (const [file, dir] of events) {
			if (file.endsWith(".map")) continue;
			const event: VoidFunction = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Event ${file}`);
			this.on(file.split(".")[0], event.bind(null, this));
		}
	}
	async loadCommands() {
		const commands = await findRecursive(`${__dirname}/commands`);
		for (const [file, dir] of commands) {
			if (file.endsWith(".map")) continue;
			const command: Command = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Command ${file}`);
			this.commands.set(command.name, command);
		}
	}
	async loadInteractions() {
		const interactions = await findRecursive(`${__dirname}/interactions`);
		for (const [file, dir] of interactions) {
			if (file.endsWith(".map")) continue;
			const interaction: Interaction = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Interaction ${file}`);
			this.interactions.set(interaction.name.replace(/\s/g, "_"), interaction);
		}
	}
	async loadJobs() {
		const jobs = await findRecursive(`${__dirname}/jobs`);
		for (const [file, dir] of jobs) {
			if (file.endsWith(".map")) continue;
			const job: Job = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Job ${file}`);
			this.jobs.set(job.name, job);
		}
	}
	async startJobs() {
		this.jobs.forEach(job => {
			Schedule.scheduleJob(job.name, job.cronInterval, job.task.bind(null, this));
		});
	}
	// Orizuru-Specific
	async loadOrizuruHandlers() {
		const handlers = await findRecursive(`${__dirname}/clients/orizuru/handlers`);
		for (const [file, dir] of handlers) {
			if (file.endsWith(".map")) continue;
			const handler: Handler<HandlerFunction<Bot, HandlerType>> = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Orizuru Handler ${file}`);
			this.clients.orizuru.addHandler(handler.type, handler.run);
		}
	}
	async start() {
		await this.database.init();
		await this.registerEvents();
		await this.loadCommands();
		await this.loadInteractions();
		await this.loadJobs();
		await this.loadOrizuruHandlers();
		await this.login(this.config.token);
		await this.startJobs();
	}
}
export default Bot;