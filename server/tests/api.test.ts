import request from "supertest";
import app from "../src/index";

jest.mock("uuid", () => ({ v4: () => "mock-uuid-1234" }));
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "Mocked response" } }]
          })
        }
      }
    }))
  };
});

describe("Agent Orchestration API", () => {
  it("should fail chat without sessionId", async () => {
    const res = await request(app).post("/api/chat").send({ message: "Hello" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
  
  it("should clear session", async () => {
    const res = await request(app).post("/api/session/test-123/clear");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
