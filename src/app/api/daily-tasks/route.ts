import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTodaysTasks, toggleTask } from '@/lib/db';

/**
 * GET /api/daily-tasks
 * Get today's tasks for the logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tasks = await getTodaysTasks(userId);

    // Calculate completion percentage
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      tasks: tasks.map(task => ({
        id: task.id,
        label: task.taskData.label,
        done: task.status === 'completed',
        tag: task.taskData.tag,
        link: task.taskData.link,
        priority: task.priority,
        meta: task.taskData.meta
      })),
      stats: {
        total,
        completed,
        percentage
      }
    });
  } catch (error) {
    console.error('❌ Error fetching daily tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/daily-tasks
 * Toggle task completion status
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('krakkify-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await req.json();

    if (!taskId || typeof taskId !== 'number') {
      return NextResponse.json({ error: 'Invalid taskId' }, { status: 400 });
    }

    const updatedTask = await toggleTask(userId, taskId);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({
      task: {
        id: updatedTask.id,
        label: updatedTask.taskData.label,
        done: updatedTask.status === 'completed',
        tag: updatedTask.taskData.tag,
        link: updatedTask.taskData.link
      }
    });
  } catch (error) {
    console.error('❌ Error toggling task:', error);
    return NextResponse.json(
      { error: 'Failed to toggle task' },
      { status: 500 }
    );
  }
}
