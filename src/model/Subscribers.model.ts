import { Collection, Db } from "mongodb";

export interface Subscribers {
	userId: string;
	firstFollow: string;
	lastFollow: string;
	broadcasterId: string;
}

export default class FollowersModel {
	private collection: Collection<Subscribers>;

	constructor(db: Db) {
		this.collection = db.collection<Subscribers>("Subscribers");
	}

	public async add(follower: Subscribers) {
		return await this.collection.insertOne(follower);
	}

	public async get(userId: string): Promise<Subscribers | null> {
		return await this.collection.findOne({ userId });
	}

	public async findIn(
		userId: string,
		broadcasterId: string
	): Promise<Subscribers | null> {
		return await this.collection.findOne({
			broadcasterId: broadcasterId,
			userId: userId,
		});
	}
}
