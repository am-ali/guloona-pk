import { MongoClient, Db, Collection } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'guloona');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export interface UserProfile {
  _id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder_width?: string;
  dress_length_preference?: string;
  preferred_colors?: string[];
  preferred_fabrics?: string[];
  style_preferences?: string[];
  size_preference?: string;
  budget_range?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserProfileService {
  private collection: Collection<UserProfile>;

  constructor(db: Db) {
    this.collection = db.collection<UserProfile>('user_profiles');
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    return await this.collection.findOne({ user_id: userId });
  }

  async createProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const newProfile: UserProfile = {
      ...profileData,
      user_id: profileData.user_id!,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await this.collection.insertOne(newProfile);
    return { ...newProfile, _id: result.insertedId.toString() };
  }

  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const updateData = {
      ...profileData,
      updated_at: new Date(),
    };

    const result = await this.collection.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );

    return result || null;
  }

  async deleteProfile(userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ user_id: userId });
    return result.deletedCount > 0;
  }
}
