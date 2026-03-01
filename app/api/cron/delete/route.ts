import { NextResponse } from 'next/server';
import { executeAndLog } from '@/lib/log-activity';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    const result = await executeAndLog(
      `openclaw cron remove ${id}`,
      `Deleted cron job: ${id}`,
      { id }
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
