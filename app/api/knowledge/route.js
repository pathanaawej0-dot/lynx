import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllUserMessages, searchUserMessages } from '@/lib/db';
import { generateEmbedding } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let messages;

    if (search?.trim()) {
      try {
        const embedding = await generateEmbedding(search);
        messages = await searchUserMessages(session.user.id, embedding, limit);
      } catch (error) {
        console.error('Error in semantic search:', error);
        messages = await getAllUserMessages(session.user.id, limit, offset);
      }
    } else {
      messages = await getAllUserMessages(session.user.id, limit, offset);
    }

    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in knowledge API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
