import dbconnect from "../../../../components/dbconnect.ts";
import Homework from "../../../../models/homework.ts";
import {getuser} from "../../../../components/user.server.ts";
import {hasPerms} from "../../../../components/auth.ts";

await dbconnect();


// TODO: temp fix for build errors (adding unused request)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> },) {
    let homework
    const id = (await params).id;
    const user = await getuser()

    try {
        if (hasPerms(user, "homework", "view")) {
            homework = await Homework.findById(id)

            return new Response(JSON.stringify(homework), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
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
        if (hasPerms(user, "homework", "edit")) {
            const homework = await Homework.findByIdAndUpdate(
                id,
                {
                    subject: body.subject,
                    deadline: body.deadline,
                    description: body.description
                },
                { new: true }
            );

            if (!homework) {
                return new Response(JSON.stringify({ error: "Homework not found" }), {
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
export async function DELETE(request:Request, { params }: { params: Promise<{ id: string }> },) {
    let homework
    const id = (await params).id;
    const user = await getuser()

    try {
        if (hasPerms(user, "homework", "delete")) {
            homework = await Homework.findById(id)
            await homework.deleteOne()

            return new Response(JSON.stringify({message: "Deleted Homework successfully."}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
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