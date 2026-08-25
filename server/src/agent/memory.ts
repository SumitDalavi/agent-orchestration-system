import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface Session {
  id: string;
  messages: ChatMessage[];
  pendingAction: PendingAction | null;
}

export interface PendingAction {
  toolCallId: string;
  toolName: string;
  toolArgs: any;
  timestamp: string;
}

const sessions = new Map<string, Session>();

export function getOrCreateSession(id?: string): Session {
  const sessionId = id || uuidv4();
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      messages: [{ role: 'system', content: 'You are a helpful assistant with access to tools. If you use a tool that requires approval, you must wait for the user to approve before continuing.' }],
      pendingAction: null
    });
  }
  return sessions.get(sessionId)!;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function addMessage(sessionId: string, message: ChatMessage) {
  const session = getOrCreateSession(sessionId);
  session.messages.push(message);
}

export function setPendingAction(sessionId: string, action: PendingAction | null) {
  const session = getOrCreateSession(sessionId);
  session.pendingAction = action;
}

export function clearSession(sessionId: string) {
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    session.messages = [session.messages[0]]; // keep system prompt
    session.pendingAction = null;
  }
}
