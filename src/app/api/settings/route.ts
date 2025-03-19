import dbconnect from "../../../components/dbconnect.ts";
import Settings from "../../../models/settings.ts";
import {auth} from "@clerk/nextjs/server";
import Homework from "../../../models/homework.ts";
import {hasPerms} from "../../../components/auth.ts";
import {getuser} from "../../../components/user.server.ts";

await dbconnect();

export async function GET() {
    const { userId } = await auth()
    const user = await getuser()

    try {
        if (hasPerms(user, "homework", "view")) {
            const settings = await Settings.findOne({ username: userId });

            if (!settings && userId) {
                const createSettings = new Settings({
                    username: userId,
                    settings: {
                        ntfy: false,
                        lesson: false,
                        hwreminder: false,
                        examreminder: false,
                    }
                })
                const newSettings = await createSettings.save()
                return new Response(JSON.stringify(newSettings.settings), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if(userId) {
                return new Response(JSON.stringify(settings.settings), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: err }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PATCH(request: Request) {
    let settings
    const { userId } = await auth()
    const body = await request.json();
    const user = await getuser()

    try {
        if (hasPerms(user, "homework", "view")) {
            settings = await Settings.findOne({ username: userId });

            if (!settings) {
                settings = new Homework(body.settings);
                await settings.save();
                return new Response(JSON.stringify({ error: "Settings created" }), {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                settings.settings = body.settings;
                await settings.save();

                return new Response(JSON.stringify({message: "Patched Homework successfully."}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}