module.exports = {
	// The bot Token
	token: 'Discord Bot Token',
	prefix: 'custombot.',
	// The bot Admins - Can use commands like `[prefix]stats`
	admins: ['Discord ID', 'Discord ID'],
	activity: {
		message: 'Activity Name',
		type: 'PLAYING',
	},
	embedColor: '0099ff',
	// Database
	database: {
		// Either 'sqlite' or 'mysql'
		type: 'mysql',
		// Ingored if type is 'sqlite'
		database: 'database',
		// MySQL Specific Settings
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'password',
		// Other Settings
		verbose: false,
		sync: true,
	},
	// Logging
	logging: {
		enabled: true,
		channel: 'Discord Channel ID',
		level: 'warning',
	},
}