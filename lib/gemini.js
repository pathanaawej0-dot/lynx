import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingGenAI = new GoogleGenerativeAI(process.env.GEMINI_EMBEDDING_API_KEY);

export async function generateEmbedding(text) {
  try {
    const model = embeddingGenAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function agentDecision(userMessage, chatHistory, retrievedContext = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const contextSummary = retrievedContext.length > 0 
      ? `Already retrieved context:\n${retrievedContext.map((c, i) => `[Query ${i + 1}]: ${c.query}\n${c.results}`).join('\n\n')}`
      : 'No context retrieved yet.';
    
    const recentHistory = chatHistory.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    
    const decisionPrompt = `Analyze this user message and decide if you need to search the user's past conversation history to provide a better response.

Recent conversation:
${recentHistory}

Current user message: "${userMessage}"

${contextSummary}

You must respond with ONLY a valid JSON object (no markdown, no code blocks):
{"needsSearch": true/false, "searchQuery": "search query if needed", "reason": "brief internal reason"}

Respond with needsSearch: true ONLY if:
- User explicitly asks about past conversations or memories
- User references something they mentioned before ("like I said", "remember when", "as I told you")
- User asks a follow-up that requires historical context not in the recent conversation
- The question would benefit from knowing user's preferences/history

Respond with needsSearch: false if:
- It's a general knowledge question
- It's a greeting or casual chat
- The current conversation has enough context
- You already have sufficient context from previous searches`;

    const result = await model.generateContent(decisionPrompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { needsSearch: false, searchQuery: '', reason: 'Could not parse response' };
  } catch (error) {
    console.error('Error in agentDecision:', error);
    return { needsSearch: false, searchQuery: '', reason: 'Error in decision' };
  }
}

export async function* streamChat(messages, context = '') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const systemPrompt = `You are Lynx, an AI assistant with perfect memory. You have access to the user's entire conversation history stored in a vector database. You can recall past conversations and provide contextually relevant responses.

${context ? `Relevant context from past conversations:\n${context}\n` : ''}

Guidelines:
- Be helpful, friendly, and conversational
- When referencing past conversations, be natural about it
- If you don't have relevant context, just respond normally
- Keep responses concise but informative`;

    const chatHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System instruction: ' + systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I am Lynx, an AI assistant with perfect memory. I will help users while referencing relevant past conversations when appropriate.' }] },
        ...chatHistory,
      ],
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error('Error in streamChat:', error);
    throw error;
  }
}

export async function generateTitle(message) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(`Generate a very short title (3-5 words max) for a conversation that starts with this message. Only respond with the title, nothing else:\n\n"${message}"`);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Conversation';
  }
}
