import dbconnect from "../../../components/dbconnect.ts";
import Homework from "../../../models/homework.ts";
import {hasPerms} from "../../../components/auth.ts";
import {getuser} from "../../../components/user.server.ts";

await dbconnect();

export async function GET() {
    const user = await getuser()

    try {
        if (hasPerms(user, "homework", "view")) {
            const homework = await Homework.find();

            return new Response(JSON.stringify(homework), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({error: err}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }

}

export async function POST(request: Request) {
    const user = await getuser()

    if (hasPerms(user, "homework", "create")) {

        const body = await request.json();

        const homework = new Homework({
            subject: body.subject,
            deadline: body.deadline,
            description: body.description,
        })

        try {
            const newHomework = await homework.save()

            return new Response(JSON.stringify(newHomework), {
                status: 201,
                headers: {'Content-Type': 'application/json'}
            })
        } catch (err) {
            return new Response(JSON.stringify(err), {
                status: 400,
                headers: {'Content-Type': 'application/json'}
            })
        }
    } else {
        return new Response(JSON.stringify({error: "Unauthorized"}), {
            status: 401,
            headers: {'Content-Type': 'application/json'}
        })
    }

}