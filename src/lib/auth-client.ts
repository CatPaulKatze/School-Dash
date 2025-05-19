import { createAuthClient } from "better-auth/react";
import {passkeyClient} from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        passkeyClient(),
        usernameClient()
    ],
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;