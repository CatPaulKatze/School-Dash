import dbconnect from "../../../components/dbconnect.ts";
import Exams from "../../../models/exams.ts";
import {hasPerms} from "../../../components/auth.ts";
import {getuser} from "../../../components/user.server.ts";

await dbconnect();

export async function GET() {
    const user = await getuser()

    try {
        if (hasPerms(user, "exams", "view")) {
            const exams = await Exams.find();

            return new Response(JSON.stringify(exams), {
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

    if (hasPerms(user, "exams", "create")) {

        const body = await request.json();
        let description = " "

        if (!(body.description == "")) {
            description = body.description
        }

        const exam = new Exams({
            subject: body.subject,
            type: body.type,
            day: body.day,
            description: description,
        })
        console.log()

        try {
            const newExam = await exam.save()

            return new Response(JSON.stringify(newExam), {
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