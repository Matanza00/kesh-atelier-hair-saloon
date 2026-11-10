import { send } from '../lib/store.mjs';

// Public settings the page needs. The ElevenLabs agent ID is safe to expose.
export default function handler(req, res) {
  send(res, 200, { agentId: process.env.ELEVENLABS_AGENT_ID || null });
}
