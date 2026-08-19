import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/db';
import AnalyticsEvent from '@/models/analyticsEventModel';
const allowed = new Set(['project_open', 'project_demo', 'project_source', 'share', 'copy_link', 'post_view', 'reading_complete', 'filter', 'search', 'saved', 'contact_started', 'contact_sent']);
export async function POST(request: NextRequest) { const body = await request.json().catch(() => null); if (!allowed.has(body?.name)) return NextResponse.json({ ok: false }, { status: 400 }); if (!process.env.MONGODB_URI) return NextResponse.json({ ok: true }); await connectToMongoDB(); await AnalyticsEvent.create({ name: body.name, path: typeof body.path === 'string' ? body.path : '', label: typeof body.label === 'string' ? body.label : '', locale: body.locale === 'ja' ? 'ja' : 'en' }); return NextResponse.json({ ok: true }); }
