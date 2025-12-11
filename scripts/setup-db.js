const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
});

async function setupDatabase() {
  console.log('Setting up database...\n');

  try {
    // Enable pgvector extension
    console.log('1. Enabling pgvector extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    console.log('   ✓ pgvector extension enabled\n');

    // Create users table
    console.log('2. Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        image TEXT,
        email_verified TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('   ✓ users table created\n');

    // Create accounts table
    console.log('3. Creating accounts table...');
    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, provider_account_id)
      )
    `;
    console.log('   ✓ accounts table created\n');

    // Create sessions table
    console.log('4. Creating sessions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        session_token TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      )
    `;
    console.log('   ✓ sessions table created\n');

    // Create conversations table
    console.log('5. Creating conversations table...');
    await sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT DEFAULT 'New Conversation',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('   ✓ conversations table created\n');

    // Create messages table
    console.log('6. Creating messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id),
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        embedding vector(768),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('   ✓ messages table created\n');

    // Create indexes
    console.log('7. Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)`;
    console.log('   ✓ indexes created\n');

    // Create vector index (may fail if not enough data, that's ok)
    console.log('8. Creating vector index...');
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_messages_embedding ON messages USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`;
      console.log('   ✓ vector index created\n');
    } catch (e) {
      console.log('   ⚠ Vector index skipped (will be created when data exists)\n');
    }

    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

setupDatabase();
