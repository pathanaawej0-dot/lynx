import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { planId, amount } = await req.json();

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock for development if keys missing
      return new Response(JSON.stringify({
          id: 'order_mock_' + Date.now(),
          currency: 'INR',
          amount: amount * 100
      }), { status: 200 });
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${session.user.id}_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return new Response(JSON.stringify({ error: 'Payment initialization failed' }), { status: 500 });
  }
}
