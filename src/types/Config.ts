type BotConfig = {
	prefix: string;
	token: string;
	client_secret: string;
	admins: string[];
	activity: {
		message: string;
		type: string;
	};
	defaultEmbedColor: string;

	// Database
	database: DatabaseConfig;
	// API
	api: APIConfig;
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
type APIConfig = {
	password: string;
	port: number;
};
export { BotConfig, DatabaseConfig };