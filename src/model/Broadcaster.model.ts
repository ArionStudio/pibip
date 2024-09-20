import { AccessToken, AccessTokenWithUserId } from "@twurple/auth";
import { Collection, Db } from "mongodb";

export interface Broadcaster extends AccessTokenWithUserId {}

export default class BroadcasterModel {
	private collection: Collection<Broadcaster>;

	constructor(db: Db) {
		this.collection = db.collection<Broadcaster>("Broadcaster");
	}

	public async add(user: Broadcaster) {
		return await this.collection.insertOne(user);
	}

	public async get(userId: string) {
		return await this.collection.findOne({ userId });
	}

	public async update(userId: string, accessToken: AccessToken) {
		return await this.collection.updateOne(
			{ userId },
			{
				$set: {
					accessToken: accessToken.accessToken,
					refreshToken: accessToken.refreshToken,
					expiresIn: accessToken.expiresIn,
					obtainmentTimestamp: accessToken.obtainmentTimestamp,
				},
			}
		);
	}

	public async getAll() {
		return await this.collection.find().toArray();
	}
}
