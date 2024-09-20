import { Collection, Db } from "mongodb";

export interface Followers {
	userId: string;
	firstFollow: string;
	lastFollow: string;
	broadcasterId: string;
}

export default class FollowersModel {
	private collection: Collection<Followers>;

	constructor(db: Db) {
		this.collection = db.collection<Followers>("Followers");
	}

	public async add(follower: Followers) {
		return await this.collection.insertOne(follower);
	}

	public async get(userId: string): Promise<Followers | null> {
		return await this.collection.findOne({ userId });
	}

	public async findIn(
		userId: string,
		broadcasterId: string
	): Promise<Followers | null> {
		return await this.collection.findOne({
			broadcasterId: broadcasterId,
			userId: userId,
		});
	}
}
