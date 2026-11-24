
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
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 10000,
};

const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient ||
  new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("weddingplan");

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

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [jwt()],
});
