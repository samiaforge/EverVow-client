
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
  connectTimeoutMS: 30000,
};

let client;
let clientBroken = false;

function getClient() {
  // A failed connect calls topology.close() but leaves client.topology set,
  // so check isDestroyed() instead of relying on the property existing.
  if (!client || clientBroken || client.topology?.isDestroyed()) {
    client = new MongoClient(uri, options);
    clientBroken = false;
  }
  return client;
}

function resetClient() {
  clientBroken = true;
}

// The adapter captures this object once. Resolve the live client per call.
const db = new Proxy({}, {
  get(_target, prop) {
    const liveDb = getClient().db("weddingplan");
    const value = liveDb[prop];
    return typeof value === "function" ? value.bind(liveDb) : value;
  },
});

// mongodbAdapter() returns a factory: Better Auth calls it with its options.
// Retry once with a fresh client if the topology dies during an operation.
const adapterFactory = mongodbAdapter(db);

const database = new Proxy(adapterFactory, {
  apply(target, thisArg, args) {
    const adapter = target(...args);
    return new Proxy(adapter, {
      get(current, prop) {
        const value = current[prop];
        if (typeof value !== "function") return value;
        return async (...callArgs) => {
          try {
            return await value.apply(current, callArgs);
          } catch (error) {
            if (error?.name === "MongoTopologyClosedError") {
              resetClient();
              return await current[prop](...callArgs);
            }
            throw error;
          }
        };
      },
    });
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
        input: true,
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

  database,

  plugins: [jwt()],
});
