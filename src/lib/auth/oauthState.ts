import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Google's OAuth redirect can't carry an Authorization header, so the
 * authenticated userId is round-tripped through the `state` param instead.
 * HMAC-signed so a caller can't forge a callback for someone else's userId.
 */
function getStateSecret(): string {
  const secret = process.env.OAUTH_STATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error('OAUTH_STATE_SECRET (or SUPABASE_SERVICE_ROLE_KEY) must be set to sign OAuth state');
  }
  return secret;
}

export function signState(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId, ts: Date.now() })).toString('base64url');
  const signature = createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyState(state: string): string {
  const [payload, signature] = state.split('.');
  if (!payload || !signature) {
    throw new Error('Malformed OAuth state');
  }

  const expectedSignature = createHmac('sha256', getStateSecret()).update(payload).digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    throw new Error('Invalid OAuth state signature');
  }

  const { userId, ts } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));

  if (Date.now() - ts > 10 * 60 * 1000) {
    throw new Error('OAuth state expired');
  }

  return userId;
}
