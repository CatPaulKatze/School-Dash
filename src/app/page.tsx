import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <div className="mt-4 ml-4">
            <h1 className="text-4xl">Hi{!session ? "!" : " " + session.user.name + "!"}</h1>
        </div>
    )

}