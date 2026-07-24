import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createStudyGroup, getUserGroups } from '@/lib/db';

/**
 * GET /api/groups
 * List all study groups the logged-in user belongs to.
 */
export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scoreyo-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const groups = await getUserGroups(userId);
    return NextResponse.json({ groups });
  } catch (error) {
    console.error('[Groups] Failed to list groups:', error);
    return NextResponse.json({ error: 'Failed to load groups' }, { status: 500 });
  }
}

/**
 * POST /api/groups
 * Create a new study group (creator becomes owner + first member).
 * Body: { name: string, description?: string, examId?: string }
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scoreyo-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = (body?.name ?? '').toString().trim();
    const description = (body?.description ?? '').toString().trim();
    const examId = body?.examId ? body.examId.toString() : null;

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }
    if (name.length > 80) {
      return NextResponse.json({ error: 'Group name is too long (max 80)' }, { status: 400 });
    }

    const group = await createStudyGroup(userId, name, description, examId);
    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('[Groups] Failed to create group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
