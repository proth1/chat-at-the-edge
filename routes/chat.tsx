import { callKnowledgeGraphAPI } from "../services/knowledgeGraph";
import { withRetry } from "../utils/retry";

export const chatHandler = async (c, payload, env) => {
  const userMessage = payload.messages[payload.messages.length - 1].content;

  // Call Knowledge Graph API
  const knowledgeGraphResponse = await callKnowledgeGraphAPI(userMessage);

  // Prepare LLM messages with the knowledge graph result
  const messages = [
    { role: "system", content: `Knowledge Graph Result: ${knowledgeGraphResponse}` },
    ...payload.messages,
  ];

  if (payload?.config?.systemMessage) {
    messages.unshift({
      role: "system",
      content: payload.config.systemMessage,
    });
  }

  // Retry logic for invoking LLM
  const eventSourceStream = await withRetry(async () => {
    return (await env.AI.run(payload.config.model, {
      messages,
      stream: true,
    })) as ReadableStream;
  });

  // Stream response
  const tokenStream = eventSourceStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream());

  return tokenStream;
};