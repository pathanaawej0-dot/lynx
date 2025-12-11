import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export async function createUser({ id, email, name, image }) {
  // Add credits initialization
  const result = await sql`
    INSERT INTO users (id, email, name, image, created_at, credits, last_reset_date)
    VALUES (${id}, ${email}, ${name}, ${image}, NOW(), 10, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      image = EXCLUDED.image
    RETURNING *
  `;
  return result[0];
}

export async function getUserByEmail(email) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0];
}

export async function getUserById(id) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return result[0];
}

export async function createAccount(account) {
  const result = await sql`
    INSERT INTO accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
    VALUES (${account.id}, ${account.userId}, ${account.type}, ${account.provider}, ${account.providerAccountId}, ${account.refresh_token || null}, ${account.access_token || null}, ${account.expires_at || null}, ${account.token_type || null}, ${account.scope || null}, ${account.id_token || null}, ${account.session_state || null})
    ON CONFLICT (provider, provider_account_id) DO NOTHING
    RETURNING *
  `;
  return result[0];
}

export async function getAccountByProvider(provider, providerAccountId) {
  const result = await sql`
    SELECT * FROM accounts WHERE provider = ${provider} AND provider_account_id = ${providerAccountId}
  `;
  return result[0];
}

export async function createConversation(userId, title = 'New Conversation') {
  const result = await sql`
    INSERT INTO conversations (user_id, title, created_at, updated_at)
    VALUES (${userId}, ${title}, NOW(), NOW())
    RETURNING *
  `;
  return result[0];
}

export async function getConversations(userId) {
  const result = await sql`
    SELECT * FROM conversations
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `;
  return result;
}

export async function getConversation(id, userId) {
  const result = await sql`
    SELECT * FROM conversations
    WHERE id = ${id} AND user_id = ${userId}
  `;
  return result[0];
}

export async function updateConversation(id, userId, title) {
  const result = await sql`
    UPDATE conversations
    SET title = ${title}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;
  return result[0];
}

export async function deleteConversation(id, userId) {
  await sql`
    DELETE FROM conversations
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

export async function createMessage({ conversationId, userId, role, content }) {
  const result = await sql`
    INSERT INTO messages (conversation_id, user_id, role, content, created_at)
    VALUES (${conversationId}, ${userId}, ${role}, ${content}, NOW())
    RETURNING *
  `;
  return result[0];
}

export async function updateMessageEmbedding(messageId, embedding) {
  const embeddingStr = `[${embedding.join(',')}]`;
  await sql`
    UPDATE messages
    SET embedding = ${embeddingStr}::vector
    WHERE id = ${messageId}
  `;
}

export async function getMessages(conversationId) {
  const result = await sql`
    SELECT * FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `;
  return result;
}

export async function semanticSearch(userId, embedding, currentConversationId, limit = 5) {
  const embeddingStr = `[${embedding.join(',')}]`;
  const result = await sql`
    SELECT content, role, created_at, conversation_id
    FROM messages
    WHERE user_id = ${userId}
    AND conversation_id != ${currentConversationId}
    AND embedding IS NOT NULL
    ORDER BY embedding <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `;
  return result;
}

export async function getAllUserMessages(userId, limit = 50, offset = 0) {
  const result = await sql`
    SELECT m.*, c.title as conversation_title
    FROM messages m
    LEFT JOIN conversations c ON m.conversation_id = c.id
    WHERE m.user_id = ${userId}
    ORDER BY m.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  return result;
}

export async function searchUserMessages(userId, embedding, limit = 50) {
  const embeddingStr = `[${embedding.join(',')}]`;
  const result = await sql`
    SELECT m.*, c.title as conversation_title
    FROM messages m
    LEFT JOIN conversations c ON m.conversation_id = c.id
    WHERE m.user_id = ${userId}
    AND m.embedding IS NOT NULL
    ORDER BY m.embedding <=> ${embeddingStr}::vector
    LIMIT ${limit}
  `;
  return result;
}

export async function updateConversationTimestamp(conversationId) {
  await sql`
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = ${conversationId}
  `;
}

// Credit Management
export async function checkAndResetCredits(userId) {
  // Check if reset needed
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    // Fallback if columns don't exist yet (handle gracefully in code if DB not migrated)
    const credits = user.credits ?? 10;
    const lastReset = user.last_reset_date ? new Date(user.last_reset_date) : new Date(0);
    const now = new Date();

    // Check if it's a new day
    if (lastReset.toDateString() !== now.toDateString()) {
      // Reset credits
      await sql`
        UPDATE users
        SET credits = 10, last_reset_date = NOW()
        WHERE id = ${userId}
      `;
      return 10;
    }

    return credits;
  } catch (e) {
    console.error("Error checking credits:", e);
    return 10; // Fail open if DB issue, or handle otherwise
  }
}

export async function decrementCredits(userId) {
  try {
     const result = await sql`
      UPDATE users
      SET credits = credits - 1
      WHERE id = ${userId} AND credits > 0
      RETURNING credits
    `;
    return result.length > 0;
  } catch (e) {
    console.error("Error decrementing credits:", e);
    return true; // Fail open
  }
}

export default sql;
