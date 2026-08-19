import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/db';
import RequestModel, { type RequestKind } from '@/models/requestModel';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const kind = body?.kind as RequestKind;
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const details = typeof body?.details === 'string' ? body.details.trim() : '';
  const contact = typeof body?.contact === 'string' ? body.contact.trim() : '';
  const timeline = typeof body?.timeline === 'string' ? body.timeline.trim() : '';
  const budget = typeof body?.budget === 'string' ? body.budget.trim() : '';
  const preferredContact = typeof body?.preferredContact === 'string' ? body.preferredContact.trim() : '';
  const locale = body?.locale === 'ja' ? 'ja' : 'en';

  if (!['project', 'article', 'contact'].includes(kind) || title.length < 3 || details.length < 10 || details.length > 6000) {
    return NextResponse.json({ error: 'Please include a title and a little more detail.' }, { status: 400 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'Request storage is not configured yet.' }, { status: 503 });
  }

  await connectToMongoDB();
  const savedRequest = await RequestModel.create({ kind, title, details, contact: contact || undefined, timeline: timeline || undefined, budget: budget || undefined, preferredContact: preferredContact || undefined, locale });

  let notificationSent = false;
  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: 'modularmanul@gmail.com',
        subject: `[Kitty Kio] New ${kind} request: ${title}`,
        text: `A new ${kind} request was submitted.\n\nTitle: ${title}\n\nDetails:\n${details}\n\nContact: ${contact || 'Not provided'}\nPreferred contact: ${preferredContact || 'Not provided'}\nTimeline: ${timeline || 'Not provided'}\nBudget: ${budget || 'Not provided'}\nLocale: ${locale}\nStatus: new`,
      });
      notificationSent = true;
    } catch (error) {
      console.error('Request notification failed:', error);
    }
  }

  return NextResponse.json({ id: savedRequest.id, status: savedRequest.status, notificationSent }, { status: 201 });
}
