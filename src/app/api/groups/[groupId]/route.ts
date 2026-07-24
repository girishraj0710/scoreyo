import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getGroupByIdForMember, getGroupMembers, leaveGroup } from '@/lib/db';

/**
 * GET /api/groups/[groupId]
 * Group detail (members + invite code). Only accessible to members.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scoreyo-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { groupId } = await params;
    const group = await getGroupByIdForMember(groupId, userId);
    if (!group) {
      // Either the group doesn't exist or the caller isn't a member — 404 either way.
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const members = await getGroupMembers(groupId);
    return NextResponse.json({ group, members });
  } catch (error) {
    console.error('[Groups] Failed to load group:', error);
    return NextResponse.json({ error: 'Failed to load group' }, { status: 500 });
  }
}

/**
 * DELETE /api/groups/[groupId]
 * Leave a group. The owner cannot leave in Phase 1.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('scoreyo-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { groupId } = await params;
    const left = await leaveGroup(groupId, userId);
    if (!left) {
      return NextResponse.json(
        { error: 'The group owner cannot leave the group.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Groups] Failed to leave group:', error);
    return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 });
  }
}
