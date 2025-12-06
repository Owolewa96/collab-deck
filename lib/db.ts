/**
 * MongoDB Connection Utility
 *
 * Establishes and caches a connection to MongoDB using Mongoose.
 * This follows Next.js best practices for serverless environments.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable. Check .env.local or .env.example');
}

/**
 * Global reference to cache the connection across serverless invocations.
 */
// Use a typed global access to avoid TS errors in serverless environments
let cached = (global as any).mongoose || { conn: null, promise: null };

/**
 * Connect to MongoDB.
 * Returns the connection or cached reference.
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        /* eslint-disable no-console */
        console.log('✓ Connected to MongoDB');
        /* eslint-enable no-console */
        return mongooseInstance;
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.error('✗ Failed to connect to MongoDB:', err.message);
        /* eslint-enable no-console */
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Store in global for serverless environments
// Store in global for serverless environments
if (typeof global !== 'undefined') {
  (global as any).mongoose = cached;
}

export default connectDB;
