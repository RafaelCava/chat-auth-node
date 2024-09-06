export const sendMessageParamsSchema = {
  type: "object",
  properties: {
    content: {
      type: "string",
    },
    roomId: {
      type: "string",
    },
    createdAt: {
      type: "string",
    },
  },
  required: ["content", "roomId"],
};
