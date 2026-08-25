export const toolsDefinition = [
  {
    type: "function" as const,
    function: {
      name: "calculate",
      description: "Evaluates a mathematical expression.",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "The mathematical expression to evaluate (e.g., '2 + 2 * 3').",
          },
        },
        required: ["expression"],
      },
    }
  },
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description: "Searches the web for current information.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query.",
          },
        },
        required: ["query"],
      },
    }
  },
  {
    type: "function" as const,
    function: {
      name: "send_email",
      description: "Sends an email to a recipient. MUST BE APPROVED BY HUMAN.",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "Email address of the recipient.",
          },
          subject: {
            type: "string",
            description: "Subject of the email.",
          },
          body: {
            type: "string",
            description: "Body of the email.",
          },
        },
        required: ["to", "subject", "body"],
      },
    }
  }
];

export const requiresApproval = ["send_email"];

export async function executeTool(name: string, args: any): Promise<string> {
  switch (name) {
    case "calculate":
      try {
        // Safe-ish eval for simple math for demo purposes
        const result = new Function('return ' + args.expression)();
        return String(result);
      } catch (e: any) {
        return `Error evaluating expression: ${e.message}`;
      }
    case "web_search":
      // Mock web search
      return `[Mock Search Results for "${args.query}"]: 1. Example result. 2. Another result indicating current trends.`;
    case "send_email":
      // In a real app, this would use nodemailer, SendGrid, etc.
      console.log(`[EMAIL SENT] To: ${args.to}, Subject: ${args.subject}\nBody: ${args.body}`);
      return "Email sent successfully.";
    default:
      return `Error: Tool ${name} not found.`;
  }
}
