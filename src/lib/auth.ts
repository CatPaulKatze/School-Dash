import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import {nextCookies} from "better-auth/next-js";
import {passkey} from "better-auth/plugins/passkey";
import {admin, username} from "better-auth/plugins";

let authSource: string

if (process.env.MONGODB_AUTH_SOURCE_ADMIN === "true") {
    authSource = "?authSource=admin"
}

const client = new MongoClient(process.env.MONGODB_URI + "/auth" + authSource);
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
        freshAge: 60 * 60
    },
    cookieCache: {
        enabled: true,
        maxAge: 60 * 5
    },
    plugins: [
        admin(),
        username(),
        passkey(),
        nextCookies(),
    ]
})
