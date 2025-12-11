import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, checkAndResetCredits } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Use checkAndResetCredits to ensure we return the correct daily amount (reset if needed)
    const credits = await checkAndResetCredits(session.user.id);

    // Fallback if user not found or DB error (fail open/default)
    const count = credits !== null ? credits : 10;

    return new Response(JSON.stringify({ credits: count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return new Response(JSON.stringify({ credits: 10 }), { status: 200 });
  }
}
