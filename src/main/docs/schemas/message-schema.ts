export const messageSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    content: {
      type: "string",
    },
    createdAt: {
      type: "string",
    },
    updatedAt: {
      type: "string",
    },
    ownerId: {
      type: "string",
    },
    roomId: {
      type: "string",
    },
  },
};
