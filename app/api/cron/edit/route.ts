import { NextResponse } from 'next/server';
import { executeAndLog } from '@/lib/log-activity';

export async function POST(request: Request) {
  try {
    const { id, name, schedule, command } = await request.json();

    if (!id || !name || !schedule || !command) {
      return NextResponse.json({ error: 'ID, name, schedule, and command required' }, { status: 400 });
    }

    const result = await executeAndLog(
      `openclaw cron edit ${id} --name "${name}" --schedule "${schedule}" -- ${command}`,
      `Updated cron job: ${name}`,
      { id, name, schedule, command }
    );

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
