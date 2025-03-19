import dbconnect from "../../../../components/dbconnect.ts";
import Settings from "../../../../models/settings.ts";

await dbconnect();


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> },) {
    let settings
    const id = (await params).id;
    const token = request.headers.get('Authorization')
    if (token == "123") {
        console.log(" ");
    }

    try {
        settings = await Settings.findById(id)
        await settings.deleteOne()

        return new Response(JSON.stringify({message: "Deleted Homework successfully."}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}