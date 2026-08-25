import { OpenAI } from "openai";
import { getOrCreateSession, addMessage, setPendingAction, ChatMessage } from "./memory";
import { toolsDefinition, requiresApproval, executeTool } from "./tools";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processChat(sessionId: string, userMessage?: string): Promise<any> {
  const session = getOrCreateSession(sessionId);

  if (userMessage) {
    addMessage(sessionId, { role: "user", content: userMessage });
  }

  return await runAgentLoop(sessionId);
}

async function runAgentLoop(sessionId: string): Promise<any> {
  const session = getOrCreateSession(sessionId);
  
  if (session.pendingAction) {
    return { status: "pending_approval", action: session.pendingAction };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: session.messages as any,
      tools: toolsDefinition,
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    
    // Convert to our ChatMessage format
    const newMsg: ChatMessage = {
      role: responseMessage.role as any,
      content: responseMessage.content || "",
    };
    if (responseMessage.tool_calls) {
      newMsg.tool_calls = responseMessage.tool_calls;
    }
    
    addMessage(sessionId, newMsg);

    if (responseMessage.tool_calls) {
      // For simplicity, we handle the first tool call. In a real system, you'd handle parallel calls.
      const toolCall = responseMessage.tool_calls[0] as any;
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (requiresApproval.includes(functionName)) {
        // Requires human approval, pause execution
        const action = {
          toolCallId: toolCall.id,
          toolName: functionName,
          toolArgs: functionArgs,
          timestamp: new Date().toISOString()
        };
        setPendingAction(sessionId, action);
        return { status: "pending_approval", action };
      } else {
        // Execute autonomously
        const toolResult = await executeTool(functionName, functionArgs);
        addMessage(sessionId, {
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: toolResult,
        });
        
        // Recurse to let the agent observe the result and continue
        return await runAgentLoop(sessionId);
      }
    }

    return { status: "completed", response: responseMessage.content };

  } catch (error: any) {
    console.error("Agent error:", error);
    return { status: "error", message: error.message };
  }
}

export async function approveAction(sessionId: string, approved: boolean, feedback?: string): Promise<any> {
  const session = getOrCreateSession(sessionId);
  const action = session.pendingAction;
  
  if (!action) {
    throw new Error("No pending action to approve.");
  }

  setPendingAction(sessionId, null);

  if (approved) {
    const toolResult = await executeTool(action.toolName, action.toolArgs);
    addMessage(sessionId, {
      role: "tool",
      tool_call_id: action.toolCallId,
      name: action.toolName,
      content: toolResult,
    });
  } else {
    addMessage(sessionId, {
      role: "tool",
      tool_call_id: action.toolCallId,
      name: action.toolName,
      content: `Error: User rejected the action.${feedback ? ' Feedback: ' + feedback : ''}`,
    });
  }

  // Resume the loop
  return await runAgentLoop(sessionId);
}
