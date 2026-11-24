// test.mjs
import { MongoClient } from "mongodb";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const uri = process.env.BETTER_AUTH_DB_URI;
if (!uri) throw new Error("BETTER_AUTH_DB_URI missing");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  console.log(await client.db("weddingplan").command({ ping: 1 }));
} catch (err) {
  console.error("CONNECT FAILED:", err.name, err.message);
} finally {
  await client.close();
}