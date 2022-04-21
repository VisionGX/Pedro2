import { DataSource } from "typeorm";

class SPDatabase {
	readonly source: DataSource;
	constructor() {
		this.source = new DataSource({
			type: "sqlite",
			database: "./temp/sp.db",
			synchronize: true,
			logging: false,
			entities: [
				__dirname + "/../database/models/*.js",
			],
		});
	}
	async init() {
		try{
			console.log("[SPDatabase] Initializing persistent database...");
			await this.source.initialize();
			console.log("[SPDatabase] Persistent database initialized.");
		}
		catch(e){
			console.log("[SPDatabase] Failed to initialize persistent database.");
			throw e;
		}
	}
}
export default SPDatabase;