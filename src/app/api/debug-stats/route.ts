import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("prepgenie-user-id")?.value;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "No user cookie found"
      });
    }

    // Test the stats API
    const baseUrl = request.nextUrl.origin;
    const statsRes = await fetch(`${baseUrl}/api/stats`, {
      headers: {
        cookie: request.headers.get('cookie') || ''
      }
    });

    const statsData = await statsRes.json();

    return NextResponse.json({
      success: statsRes.ok,
      statusCode: statsRes.status,
      userId,
      statsData,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
