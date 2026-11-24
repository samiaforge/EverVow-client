
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const uri = process.env.BETTER_AUTH_DB_URI;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URI is missing");
}

const options = {
  maxPoolSize: 5,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 10000,
};

let client;

function getClient() {
  // The driver sets client.topology = undefined when close() runs.
  // On serverless, an idle/frozen instance can come back with a dead
  // topology, so create a fresh client instead of reusing it forever.
  if (!client || !client.topology) {
    client = new MongoClient(uri, options);
  }
  return client;
}

// The adapter stores this object once at startup. Every real database call
// is resolved live through getClient(), so a closed connection is replaced.
const db = new Proxy({}, {
  get(_target, prop) {
    const liveDb = getClient().db("weddingplan");
    const value = liveDb[prop];
    return typeof value === "function" ? value.bind(liveDb) : value;
  },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null,
    "http://localhost:3000",
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  database: mongodbAdapter(db),
  plugins: [jwt()],
});
