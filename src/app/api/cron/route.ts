import {headers} from "next/headers";

export async function GET() {
    const header = await headers()

    if (header.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response(JSON.stringify("No Success"), {
            status: 400,
            headers: {'Content-Type': 'application/json'}
        });
    }

    // Logic for later

    return new Response(JSON.stringify("Success"), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}