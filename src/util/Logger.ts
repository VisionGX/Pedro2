import winston from "winston";

export namespace Log {
	export class Logger {
		private static instance: Logger | null = null;
		private logger!: winston.Logger;
		constructor() {
			if(Logger.instance) 
				return Logger.instance;
			this.logger = winston.createLogger({
				level: "info",
				format: winston.format.json(),
				transports: [
					new winston.transports.Console({
						format: winston.format.simple(),
					}),
					new winston.transports.File({
						filename: "./temp/logs/sp.log",
						format: winston.format.simple(),
					}),
				],
			});
			Logger.instance = this;
		}
		log(level: LogLevel, message: string, ...args: any[]) {
			this.logger.log(level, message, ...args);
		}
		info(message: string, ...args: any[]) {
			this.logger.info(message, ...args);
		}
		warn(message: string, ...args: any[]) {
			this.logger.warn(message, ...args);
		}
		error(message: string, ...args: any[]) {
			this.logger.error(message, ...args);
		}
		debug(message: string, ...args: any[]) {
			this.logger.debug(message, ...args);
		}
		silly(message: string, ...args: any[]) {
			this.logger.silly(message, ...args);
		}

	}
	export enum LogLevel {
		INFO = "info",
		WARN = "warn",
		ERROR = "error",
		DEBUG = "debug",
	}

}