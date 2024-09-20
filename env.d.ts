declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production" | "test";
		client_id: string;
		client_secret: string;
		access_token: string;
		mongo_user: string;
		mongo_password: string;
		mongo_db: string;
		mongo_host: string;
		mongo_port: string;
	}
}
