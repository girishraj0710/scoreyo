import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Simple test query
    const result = await queryOne(`SELECT 1 as test`);

    return NextResponse.json({
      success: true,
      result,
      message: "Database connection works"
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
