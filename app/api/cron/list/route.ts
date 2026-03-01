import { NextResponse } from 'next/server';
import { openclaw } from '@/lib/openclaw';

export async function GET() {
  try {
    const jobs = await openclaw.getCronJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list jobs' }, { status: 500 });
  }
}
