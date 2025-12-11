import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createConversation,
  createMessage,
  updateMessageEmbedding,
  getMessages,
  semanticSearch,
  updateConversation,
  updateConversationTimestamp,
  getConversation,
  checkAndResetCredits,
  decrementCredits
} from '@/lib/db';
import { generateEmbedding, streamChat, generateTitle, agentDecision } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_AGENT_QUERIES = 3;

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationId } = await request.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;

    // Credit Check
    const currentCredits = await checkAndResetCredits(userId);
    if (currentCredits <= 0) {
       return new Response(JSON.stringify({
           error: 'Daily limit reached',
           code: 'LIMIT_REACHED'
       }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let convId = conversationId;
    let isNewConversation = false;

    if (!convId) {
      const conversation = await createConversation(userId);
      convId = conversation.id;
      isNewConversation = true;
    } else {
      const existing = await getConversation(convId, userId);
      if (!existing) {
        return new Response(JSON.stringify({ error: 'Conversation not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Decrement credits *before* starting the expensive AI work
    // In a real app, maybe decrement after success, but to prevent abuse, reserve first.
    // Simpler: decrement on success, but check here.
    // Let's decrement now.
    const success = await decrementCredits(userId);
    if (!success) {
         return new Response(JSON.stringify({
           error: 'Daily limit reached',
           code: 'LIMIT_REACHED'
       }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userMessage = await createMessage({
      conversationId: convId,
      userId,
      role: 'user',
      content: message,
    });

    try {
      const userEmbedding = await generateEmbedding(message);
      await updateMessageEmbedding(userMessage.id, userEmbedding);
    } catch (error) {
      console.error('Error generating user embedding:', error);
    }

    const existingMessages = await getMessages(convId);
    const chatHistory = existingMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const retrievedContext = [];
    let queryCount = 0;

    while (queryCount < MAX_AGENT_QUERIES) {
      console.log(`\n--- Agent Step ${queryCount + 1} ---`);
      const decision = await agentDecision(message, chatHistory, retrievedContext);
      console.log('Agent Decision:', JSON.stringify(decision, null, 2));

      if (!decision.needsSearch) {
        console.log('Agent decided no further search is needed.');
        break;
      }

      const searchQuery = decision.searchQuery || message;
      console.log('Executing Search Query:', searchQuery);

      try {
        const queryEmbedding = await generateEmbedding(searchQuery);
        const relevantMessages = await semanticSearch(userId, queryEmbedding, convId, 5);

        console.log(`Search found ${relevantMessages.length} relevant messages.`);

        if (relevantMessages.length > 0) {
          const results = relevantMessages
            .map(m => `[${m.role}]: ${m.content}`)
            .join('\n\n');

          retrievedContext.push({
            query: searchQuery,
            results: results
          });
        } else {
          retrievedContext.push({
            query: searchQuery,
            results: 'No relevant past conversations found.'
          });
        }
      } catch (error) {
        console.error('Error in agent search:', error);
        break;
      }

      queryCount++;
    }

    const context = retrievedContext.length > 0
      ? retrievedContext.map(c => c.results).join('\n\n---\n\n')
      : '';

    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (isNewConversation) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`));
          }

          for await (const chunk of streamChat(chatHistory, context)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          }

          const assistantMessage = await createMessage({
            conversationId: convId,
            userId,
            role: 'assistant',
            content: fullResponse,
          });

          try {
            const assistantEmbedding = await generateEmbedding(fullResponse);
            await updateMessageEmbedding(assistantMessage.id, assistantEmbedding);
          } catch (error) {
            console.error('Error generating assistant embedding:', error);
          }

          if (isNewConversation && fullResponse) {
            try {
              const title = await generateTitle(message);
              await updateConversation(convId, userId, title);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ title })}\n\n`));
            } catch (error) {
              console.error('Error generating title:', error);
            }
          }

          await updateConversationTimestamp(convId);
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Error in stream:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
