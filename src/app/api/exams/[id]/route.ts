import dbconnect from "../../../../components/dbconnect.ts";
import Exams from "../../../../models/exams.ts";
import {getuser} from "../../../../components/user.server.ts";
import {hasPerms} from "../../../../components/auth.ts";

await dbconnect();

// TODO: temp fix for build errors (adding unused request)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> },) {
    let exams
    const id = (await params).id;
    const user = await getuser()

    try {
        if (hasPerms(user, "exams", "view")) {
            exams = await Exams.findById(id)

            return new Response(JSON.stringify(exams), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> },) {
    const id = (await params).id;
    const body = await request.json();
    const user = await getuser()

    try {
        if (hasPerms(user, "exams", "edit")) {
            const exam = await Exams.findByIdAndUpdate(
                id,
                {
                    subject: body.subject,
                    type: body.type,
                    day: body.day,
                    description: body.description
                },
                { new: true }
            );

            if (!exam) {
                return new Response(JSON.stringify({ error: "Exam not found" }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify("Successfully Patched"), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            })
        }
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

// TODO: temp fix for build errors (adding unused request)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> },) {
    let exams
    const id = (await params).id;
    const user = await getuser()

    try {
        if (hasPerms(user, "exams", "delete")) {
        exams = await Exams.findById(id)
        await exams.deleteOne()

        return new Response(JSON.stringify({message: "Deleted Exam successfully."}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
        } else {
            return new Response(JSON.stringify({error: "Unauthorized"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            })
        }
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}