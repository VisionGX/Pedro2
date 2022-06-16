type BotConfig = {
	prefix: string;
	token: string;
	admins: string[];
	activity: {
		message: string;
		type: string;
	};
	defaultEmbedColor: string;

	// Database
	database: DatabaseConfig;
};
type DatabaseConfig = {
	type: "sqlite" | "mysql";
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;

	verbose: boolean;
	sync: boolean;
};
export { BotConfig, DatabaseConfig };