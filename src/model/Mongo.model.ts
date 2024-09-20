import { MongoClient, Db } from "mongodb";

export class MongoModel {
	private static instance: MongoModel;
	private db: Db | null = null;

	private constructor() {}

	// Singleton do uzyskania jednej instancji połączenia
	public static getInstance(): MongoModel {
		if (!MongoModel.instance) {
			MongoModel.instance = new MongoModel();
		}
		return MongoModel.instance;
	}

	// Metoda do nawiązywania połączenia
	public async connect(): Promise<Db> {
		if (this.db) return this.db; // Jeśli połączenie już istnieje, zwracamy je

		const user = process.env.mongo_user ?? "root";
		const password = process.env.mongo_password ?? "password";
		const db = process.env.mongo_db ?? "fibibot";
		const host = process.env.mongo_host ?? "pi5w";
		const port = Number(process.env.mongo_port) ?? 27017;

		const uri = `mongodb://${user}:${password}@${host}:${port}`;
		const client = new MongoClient(uri);
		await client.connect();
		this.db = client.db(db); // Nazwa bazy danych
		console.log("Połączono z bazą MongoDB");

		return this.db;
	}
}
