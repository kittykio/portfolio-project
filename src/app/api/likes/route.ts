import { NextRequest, NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/db';
import ProjectLikes from '@/models/projectLikeModel';
import BlogLikes from '@/models/blogLikeModel';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ likes: {} });

  const type = request.nextUrl.searchParams.get('type');
  const ids = (request.nextUrl.searchParams.get('ids') || '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0)
    .slice(0, 100);

  if ((type !== 'project' && type !== 'blog') || ids.length === 0) {
    return NextResponse.json({ likes: {} });
  }

  await connectToMongoDB();
  const Model = type === 'project' ? ProjectLikes : BlogLikes;
  const documents = await Model.find({ _id: { $in: ids } }).lean();
  const likes = Object.fromEntries(documents.map((document) => [document._id, document.like]));

  return NextResponse.json({ likes }, { headers: { 'Cache-Control': 'no-store' } });
}
