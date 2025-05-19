import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <>
            <h1 className="text-4xl">Hi{!session ? "!" : " " + session.user.name + "!"}</h1>
        </>
    )

}