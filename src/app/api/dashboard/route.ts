import dbconnect from "../../../components/dbconnect.ts";
import Exams from "../../../models/exams.ts";
import Homework from "../../../models/homework.ts";
import {hasPerms} from "../../../components/auth.ts";
import {getuser} from "../../../components/user.server.ts";

await dbconnect();

export async function GET() {
    const user = await getuser()

    try {
        if (hasPerms(user, "exams", "view") && hasPerms(user, "homework", "view") ) {
            const exams = await Exams.find();
            const homework = await Homework.find();

            return new Response(JSON.stringify({exams, homework}), {
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