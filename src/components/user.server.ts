import {auth} from "@clerk/nextjs/server";
import {Role, User} from "../interfaces/authint.ts";

export async function getuser() {
    const { userId, sessionClaims } = await auth();
    let user: User | undefined;

    if (sessionClaims && sessionClaims.roles) {
        user = { id: userId, roles: sessionClaims.roles as Role[] };
    } else {
        user = {id: "0", roles: []};
    }

    return user;
}