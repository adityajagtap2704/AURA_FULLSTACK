// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Queue, QueueEvents, ConnectionOptions } from 'bullmq';
import { Redis } from 'ioredis';

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
  console.warn('⚠️ Redis connection failed. Sync queue features will be offline:', err.message);
});

// Cast to ConnectionOptions to fix type compatibility
const connectionOptions = connection as unknown as ConnectionOptions;

// Sync queue for all connectors
export const syncQueue = new Queue('sync', {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
    },
  },
});

// Queue events for monitoring
export const syncQueueEvents = new QueueEvents('sync', { connection: connectionOptions });

// Health check function
//
// BullMQ requires maxRetriesPerRequest: null on the Redis connection, which
// means ioredis commands queue forever instead of rejecting when Redis is
// unreachable — without a timeout here, a downed Redis would hang this
// health check (and any caller awaiting it) indefinitely instead of
// reporting unhealthy.
export async function getQueueHealth() {
  const TIMEOUT_MS = 3000;
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Redis health check timed out')), TIMEOUT_MS)
  );

  try {
    const [jobCounts, workers] = await Promise.race([
      Promise.all([syncQueue.getJobCounts(), syncQueue.getWorkers()]),
      timeout,
    ]);

    return {
      status: 'healthy',
      jobCounts,
      activeWorkers: workers.length,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
    };
  }
}

// Export queue for use in other files
export { connection };
