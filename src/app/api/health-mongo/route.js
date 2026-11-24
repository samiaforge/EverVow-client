import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.BETTER_AUTH_DB_URI;

  if (!uri) {
    return Response.json(
      { ok: false, name: "MissingEnv", message: "BETTER_AUTH_DB_URI is missing" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    const result = await client.db("weddingplan").command({ ping: 1 });
    return Response.json({ ok: true, result });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        name: error.name,
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
