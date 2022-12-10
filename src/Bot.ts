/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, Intents } from "discord.js";
import { Command, Interaction, Job } from "./types/Executors";
import * as fs from "fs";
import Schedule from "node-schedule";
import SPDatabase from "./database";
import { Log } from "./util/Logger";
import { BotConfig } from "./types/Config";
import API from "./API";

class Bot extends Client {
	logger: Log.Logger;
	config: BotConfig;
	commands: Collection<string, Command>;
	interactions: Collection<string, Interaction>;
	jobs: Collection<string, Job>;
	database: SPDatabase;
	server: API;
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				Intents.FLAGS.GUILD_INTEGRATIONS,
				Intents.FLAGS.GUILD_WEBHOOKS,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_PRESENCES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_MESSAGE_TYPING,
				Intents.FLAGS.DIRECT_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
				Intents.FLAGS.DIRECT_MESSAGE_TYPING,
				Intents.FLAGS.GUILD_SCHEDULED_EVENTS
			]
		});
		this.logger = new Log.Logger();
		this.commands = new Collection();
		this.interactions = new Collection();
		this.jobs = new Collection();
		this.config = require("../config");
		this.database = new SPDatabase(this.config.database);
		this.server = new API(this);
	}
	async registerEvents() {
		fs.readdirSync(`${__dirname}/events`).forEach(dir => {
			fs.readdirSync(`${__dirname}/events/${dir}`).forEach(file => {
				const event = require(`./events/${dir}/${file}`).default;
				this.logger.info(`Loading Event ${file}`);
				this.on(file.split(".")[0], event.bind(null, this));
			});
		});
	}
	async loadCommands() {
		fs.readdirSync(`${__dirname}/commands`).forEach(dir => {
			fs.readdirSync(`${__dirname}/commands/${dir}`).forEach(file => {
				const command: Command = require(`./commands/${dir}/${file}`).default;
				this.logger.info(`Loading Command ${file}`);
				this.commands.set(command.name, command);
			});
		});
	}
	async loadInteractions() {
		fs.readdirSync(`${__dirname}/interactions`).forEach(dir => {
			const interactions = fs.readdirSync(`${__dirname}/interactions/${dir}`).filter(file => file.endsWith(".js"));
			interactions.forEach(file => {
				const interaction = require(`./interactions/${dir}/${file}`).default;
				this.logger.info(`Loading Interaction ${file}`);
				this.interactions.set(interaction.name.replace(/\s/g, "_"), interaction);
			});
			fs.readdirSync(`${__dirname}/interactions/${dir}`).filter(file => !file.endsWith(".js")).forEach(subdir => {
				const subinteractions = fs.readdirSync(`${__dirname}/interactions/${dir}/${subdir}`).filter(file => file.endsWith(".js"));
				subinteractions.forEach(file => {
					const interaction: Interaction = require(`./interactions/${dir}/${subdir}/${file}`).default;
					this.logger.info(`Loading Interaction ${file}`);
					this.interactions.set(interaction.name.replace(/\s/g, "_"), interaction);
				});
			});
		});
	}
	async loadJobs() {
		fs.readdirSync(`${__dirname}/jobs`).forEach(file => {
			const job: Job = require(`./jobs/${file}`).default;
			this.logger.info(`Loading Job ${file}`);
			this.jobs.set(job.name, job);
		});
	}
	async startJobs() {
		this.jobs.forEach(job => {
			Schedule.scheduleJob(job.name, job.cronInterval, job.task.bind(null, this));
		});
	}
	async start() {
		await this.database.init();
		await this.registerEvents();
		await this.loadCommands();
		await this.loadInteractions();
		await this.loadJobs();
		await this.login(this.config.token);
		await this.startJobs();
	}
}
export default Bot;