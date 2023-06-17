// eslint-disable-next-line no-undef
module.exports = {
	// The bot Token and Client_Secret
	token: "Discord Bot Token",
	prefix: "custombot.",
	client_secret: "Discord Client Secret",
	// The bot Admins - Can use commands like `[prefix]stats`
	admins: ["Discord ID", "Discord ID"],
	activity: {
		message: "Activity Name",
		type: "PLAYING",
	},
	defaultEmbedColor: "0099ff",
	// Database
	database: {
		// Either 'sqlite' or 'mysql'
		type: "mysql",
		// Ingored if type is 'sqlite'
		database: "database",
		// MySQL Specific Settings
		host: "localhost",
		port: 3306,
		user: "root",
		password: "password",
		// Other Settings
		verbose: false,
		sync: true,
	},
	// API
	api: {
		password: "API Password",
		port: 8080,
	},
	// Logging
	logging: {
		enabled: false,
		channel: "Discord Channel ID",
		level: "warning",
	},
};