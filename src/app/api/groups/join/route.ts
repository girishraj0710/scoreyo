import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { joinGroupByCode } from '@/lib/db';

/**
 * POST /api/groups/join
 * Join a study group via its invite code.
 * Body: { code: string }
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scoreyo-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const code = (body?.code ?? '').toString().trim().toLowerCase();
    if (!code) {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }

    const result = await joinGroupByCode(code, userId);
    if (!result) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    return NextResponse.json({
      group: result.group,
      alreadyMember: result.alreadyMember,
    });
  } catch (error) {
    console.error('[Groups] Failed to join group:', error);
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
  }
}
