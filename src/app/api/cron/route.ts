import { CronJob } from 'cron';

const cron = new CronJob(
    '0 */1 * * * *',
    task,
    null,
    false,
    'Europe/Vienna'
);

function task() {
    console.log('task');
}

export async function GET() {
    if (!cron.isActive) {
        cron.start()
        return new Response(JSON.stringify("Cron Process successfully started"), {
            status: 201,
            headers: {'Content-Type': 'application/json'}
        });
    } else {
        return new Response(JSON.stringify("Cron Process already started"), {
            status: 400,
            headers: {'Content-Type': 'application/json'}
        });
    }
}