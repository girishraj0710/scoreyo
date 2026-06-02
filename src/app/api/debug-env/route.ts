import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ENABLE_SECURE_ROUTES: process.env.ENABLE_SECURE_ROUTES,
    NODE_ENV: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('ENABLE') || k.includes('SECURE'))
  });
}
