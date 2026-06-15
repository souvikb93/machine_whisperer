import { MongoClient, Db } from "mongodb";

const URI = process.env.MONGO_URI!;
const DB_NAME = "machine_whisperer";

declare global {
  var _mongoClient: MongoClient | undefined;
}

export async function getDb(): Promise<Db> {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(URI, { serverSelectionTimeoutMS: 5000 });
    await global._mongoClient.connect();
  }
  return global._mongoClient.db(DB_NAME);
}

export function isMongoConfigured(): boolean {
  const uri = process.env.MONGO_URI;
  return !!uri && uri !== "paste_your_mongodb_uri_here";
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!key && key !== "paste_your_key_here";
}
