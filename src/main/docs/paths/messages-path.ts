export const messagesPath = {
  post: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ["Messages"],
    summary: "API para enviar mensagens",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/send-message-params",
          },
        },
      },
    },
    responses: {
      201: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/message",
            },
          },
        },
      },
      400: {
        $ref: "#/components/badRequest",
      },
      403: {
        $ref: "#/components/forbidden",
      },
      500: {
        $ref: "#/components/serverError",
      },
      // 400: {
      //   $ref: "#/components/badRequest",
      // },
      // 403: {
      //   $ref: "#/components/forbidden",
      // },
      // 500: {
      //   $ref: "#/components/serverError",
      // },
    },
  },
};
