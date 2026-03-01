import { NextRequest, NextResponse } from 'next/server';
import { tokenTracker } from '@/lib/token-tracker';
import { openclaw } from '@/lib/openclaw';

export async function POST(request: NextRequest) {
  try {
    const status = await openclaw.getStatus();
    
    if (status.tokenUsage) {
      await tokenTracker.track({
        used: status.tokenUsage.used,
        total: status.tokenUsage.total,
        percentage: (status.tokenUsage.used / status.tokenUsage.total) * 100,
        sessions: status.sessions,
        model: status.model,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track tokens' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hours = parseInt(searchParams.get('hours') || '24');

  try {
    const history = await tokenTracker.getHistory(hours);
    return NextResponse.json({ history });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get history' }, { status: 500 });
  }
}
